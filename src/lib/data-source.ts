import { courses, instructors, type Course, type Instructor } from "@/lib/data";
import { platformMode } from "@/lib/platform";
import { getSupabaseClient, isSupabaseConfigured, supabase } from "@/lib/supabase";

export type AppDataMode = "template" | "production";

export async function getCourses(): Promise<Course[]> {
  if (platformMode === "template" || !isSupabaseConfigured || !supabase) {
    return courses;
  }

  const client = getSupabaseClient();
  const { data, error } = await client.from("courses").select(`*, instructor:instructors(*)`);

  if (error || !data) {
    return courses;
  }

  return data.map((course) => ({
    id: String(course.id),
    title: String(course.title),
    instructorId: String(course.instructor_id ?? course.instructor?.id ?? ""),
    image: String(course.image_url ?? course.image ?? ""),
    category: String(course.category),
    level: course.level as "Beginner" | "Intermediate" | "Advanced",
    price: Number(course.price ?? 0),
    shortDescription: String(course.short_description ?? ""),
    description: Array.isArray(course.description) ? course.description.map((item) => String(item)) : [],
    outcomes: Array.isArray(course.outcomes) ? course.outcomes.map((item) => String(item)) : [],
    requirements: Array.isArray(course.requirements) ? course.requirements.map((item) => String(item)) : [],
    students: Number(course.students_count ?? 0),
    rating: Number(course.rating ?? 0),
    reviewCount: Number(course.review_count ?? 0),
    publishedAt: String(course.published_at ?? new Date().toISOString()),
    modules: Array.isArray(course.modules) ? course.modules : [],
    reviews: Array.isArray(course.reviews) ? course.reviews : [],
    faqs: Array.isArray(course.faqs) ? course.faqs : [],
  }));
}

export async function getInstructors(): Promise<Instructor[]> {
  if (platformMode === "template" || !isSupabaseConfigured || !supabase) {
    return instructors;
  }

  const client = getSupabaseClient();
  const { data, error } = await client.from("instructors").select("*");

  if (error || !data) {
    return instructors;
  }

  return data.map((instructor) => ({
    id: String(instructor.id),
    name: String(instructor.name),
    title: String(instructor.title),
    photo: String(instructor.photo_url ?? ""),
    shortBio: String(instructor.short_bio ?? ""),
    bio: String(instructor.bio ?? ""),
    students: Number(instructor.students_count ?? 0),
    rating: Number(instructor.rating ?? 0),
    years: Number(instructor.years_experience ?? 0),
    socials: Array.isArray(instructor.social_links) ? instructor.social_links : [],
  }));
}

export function getDataMode(): AppDataMode {
  return platformMode;
}
