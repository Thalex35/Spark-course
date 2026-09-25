create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  bio text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'student';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1), 'Student'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

do $$
begin
  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
exception when duplicate_object then null;
end $$;

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  title text not null,
  short_bio text not null,
  bio text not null,
  photo_url text not null,
  rating numeric(3,2) not null default 0,
  students_count integer not null default 0,
  years_experience integer not null default 0,
  social_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  instructor_id uuid not null references public.instructors(id) on delete cascade,
  category text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  price numeric(10,2) not null default 0,
  short_description text not null,
  description jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  students_count integer not null default 0,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  published_at timestamptz not null default now(),
  image_url text not null,
  faqs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.course_modules(id) on delete cascade,
  title text not null,
  duration_minutes integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  last_accessed timestamptz not null default now(),
  unique (profile_id, course_id)
);

create table if not exists public.lesson_progress (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (profile_id, lesson_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, course_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  amount numeric(10,2) not null,
  status text not null default 'pending',
  provider text not null default 'demo',
  payment_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_instructor_id on public.courses (instructor_id);
create index if not exists idx_course_modules_course_id on public.course_modules (course_id);
create index if not exists idx_course_lessons_module_id on public.course_lessons (module_id);
create index if not exists idx_enrollments_profile_id on public.enrollments (profile_id);
create index if not exists idx_lesson_progress_course_id on public.lesson_progress (course_id);
create index if not exists idx_orders_profile_id on public.orders (profile_id);

alter table public.profiles enable row level security;
alter table public.instructors enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.course_reviews enable row level security;

do $$
begin
  create policy "Public instructors are viewable" on public.instructors for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public courses are viewable" on public.courses for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public modules are viewable" on public.course_modules for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public lessons are viewable" on public.course_lessons for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Public reviews are viewable" on public.course_reviews for select using (true);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins can view profiles" on public.profiles for select using (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins can manage instructors" on public.instructors for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins can manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins can manage modules" on public.course_modules for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Admins can manage lessons" on public.course_lessons for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can manage own enrollments" on public.enrollments for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can manage own progress" on public.lesson_progress for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can manage own wishlist" on public.wishlists for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
exception when duplicate_object then null;
end $$;

do $$
begin
  create policy "Users can manage own orders" on public.orders for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
exception when duplicate_object then null;
end $$;
