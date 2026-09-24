import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, GraduationCap, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { StarRating } from "@/components/StarRating";
import { coursesByInstructor, getInstructor, testimonials } from "@/lib/data";

export const Route = createFileRoute("/instructors/$instructorId")({
  loader: ({ params }) => {
    const instructor = getInstructor(params.instructorId);
    if (!instructor) throw notFound();
    return { instructor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Coach not found — Serenity Studio" }, { name: "robots", content: "noindex" }] };
    }
    const { instructor } = loaderData;
    return {
      meta: [
        { title: `${instructor.name} — ${instructor.title} | Serenity Studio` },
        { name: "description", content: instructor.shortBio },
        { property: "og:title", content: `${instructor.name} — ${instructor.title}` },
        { property: "og:description", content: instructor.shortBio },
      ],
    };
  },
  component: InstructorPage,
});

function InstructorPage() {
  const { instructor } = Route.useLoaderData();
  const taught = coursesByInstructor(instructor.id);

  return (
    <div>
      <section className="bg-gradient-hero">
        <div className="section-x grid gap-10 py-14 sm:grid-cols-[220px_minmax(0,1fr)]">
          <img
            src={instructor.photo}
            alt={`Portrait of ${instructor.name}`}
            width={800}
            height={800}
            className="w-full max-w-[220px] rounded-3xl object-cover shadow-lift"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">{instructor.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary">
                <BadgeCheck width={14} height={14} /> Verified coach
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">{instructor.title}</p>
            <StarRating rating={instructor.rating} className="mt-3" />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">{instructor.bio}</p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {instructor.socials.map((s) => (
                <a key={s.label} href={s.url} className="text-primary hover:text-accent">
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to="/courses">View all courses</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/contact">Book a session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-x py-12">
        <dl className="grid gap-4 sm:grid-cols-4">
          {[
            { icon: Users, label: "Students taught", value: instructor.students.toLocaleString() },
            { icon: GraduationCap, label: "Courses", value: taught.length },
            { icon: Star, label: "Average rating", value: instructor.rating.toFixed(1) },
            { icon: BadgeCheck, label: "Years experience", value: instructor.years },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon width={18} height={18} />
              </span>
              <dt className="mt-3 text-xs text-muted-foreground">{label}</dt>
              <dd className="font-display text-2xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section-x pb-8">
        <h2 className="font-display text-2xl font-semibold">Courses by {instructor.name}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {taught.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section className="section-x py-14">
        <h2 className="font-display text-2xl font-semibold">Student testimonials</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="rounded-2xl border bg-card p-6 shadow-soft">
              <StarRating rating={t.rating} />
              <blockquote className="mt-3 text-sm leading-relaxed">{t.text}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">
                {t.name}
                <span className="block text-xs font-normal text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
