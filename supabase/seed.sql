insert into public.instructors (slug, name, title, short_bio, bio, photo_url, rating, students_count, years_experience, social_links)
values
  (
    'sarah-johnson',
    'Sarah Johnson',
    'Yoga & Wellness Coach',
    '500-hour certified yoga teacher helping busy people rebuild mobility without pressure.',
    'Sarah has taught yoga for twelve years across studios in Portland, Bali and San Francisco.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    4.9,
    8420,
    12,
    '[{"label":"Instagram","url":"https://instagram.com"},{"label":"YouTube","url":"https://youtube.com"}]'::jsonb
  ),
  (
    'michael-chen',
    'Dr. Michael Chen',
    'Mental Health Specialist',
    'Clinical psychologist translating evidence-based therapy into everyday practice.',
    'Dr. Michael Chen is a licensed clinical psychologist with fifteen years of practice in CBT and mindfulness-based stress reduction.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    4.8,
    11250,
    15,
    '[{"label":"LinkedIn","url":"https://linkedin.com"},{"label":"Website","url":"https://example.com"}]'::jsonb
  ),
  (
    'emma-rodriguez',
    'Emma Rodriguez',
    'Life & Business Coach',
    'ICF-certified coach for founders and freelancers who want calmer ambition.',
    'Emma Rodriguez is an ICF-certified coach who spent a decade in operations leadership before moving into coaching.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    4.9,
    5310,
    9,
    '[{"label":"LinkedIn","url":"https://linkedin.com"},{"label":"Instagram","url":"https://instagram.com"}]'::jsonb
  );

insert into public.courses (
  slug,
  title,
  instructor_id,
  category,
  level,
  price,
  short_description,
  description,
  outcomes,
  requirements,
  students_count,
  rating,
  review_count,
  published_at,
  image_url,
  faqs
)
values
  (
    'beginner-yoga-flexibility',
    'Beginner Yoga for Flexibility',
    (select id from public.instructors where slug = 'sarah-johnson'),
    'Yoga',
    'Beginner',
    29,
    'Gentle 15-minute sessions that unlock tight hips, shoulders and hamstrings.',
    '["If you have ever felt too stiff to start yoga, this is the course built for you.", "Every session is filmed from two angles with clear cues and practical variations."]'::jsonb,
    '["Move through a full beginner yoga flow with confidence","Release tight hips and shoulders safely","Build a 15-minute daily routine"]'::jsonb,
    '["A yoga mat or carpeted floor","Optional: two blocks or thick books"]'::jsonb,
    3184,
    4.9,
    412,
    '2026-02-10',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    '[{"q":"How long do I have access?","a":"Lifetime access."},{"q":"Do I need equipment?","a":"No special equipment needed."}]'::jsonb
  );

insert into public.course_modules (course_id, title, sort_order)
values
  ((select id from public.courses where slug = 'beginner-yoga-flexibility'), 'Module 1 — Foundations', 1),
  ((select id from public.courses where slug = 'beginner-yoga-flexibility'), 'Module 2 — Opening the hips', 2);

insert into public.course_lessons (course_id, module_id, title, duration_minutes, sort_order)
values
  ((select id from public.courses where slug = 'beginner-yoga-flexibility'), (select id from public.course_modules where course_id = (select id from public.courses where slug = 'beginner-yoga-flexibility') and title = 'Module 1 — Foundations'), 'Welcome and how to use this course', 6, 1),
  ((select id from public.courses where slug = 'beginner-yoga-flexibility'), (select id from public.course_modules where course_id = (select id from public.courses where slug = 'beginner-yoga-flexibility') and title = 'Module 1 — Foundations'), 'Breath before movement', 11, 2),
  ((select id from public.courses where slug = 'beginner-yoga-flexibility'), (select id from public.course_modules where course_id = (select id from public.courses where slug = 'beginner-yoga-flexibility') and title = 'Module 2 — Opening the hips'), 'Why hips get tight', 8, 3);
