import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  BarChart3,
  Clock,
  Heart,
  Link2,
  PlayCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StarRating } from "@/components/StarRating";
import { courseLessons, courseMinutes, getCourse, getInstructor } from "@/lib/data";
import { formatPrice, useApp } from "@/lib/store";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Course unavailable — Serenity Studio" }, { name: "robots", content: "noindex" }] };
    }
    const { course } = loaderData;
    return {
      meta: [
        { title: `${course.title} — Serenity Studio` },
        { name: "description", content: course.shortDescription },
        { property: "og:title", content: `${course.title} — Serenity Studio` },
        { property: "og:description", content: course.shortDescription },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const instructor = getInstructor(course.instructorId)!;
  const navigate = useNavigate();
  const { isEnrolled, wishlist, toggleWishlist, user } = useApp();
  const enrolled = isEnrolled(course.id);
  const lessons = courseLessons(course);
  const hours = Math.round((courseMinutes(course) / 60) * 10) / 10;

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Course link copied to clipboard");
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-ink text-ink-foreground">
        <div className="section-x grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-16">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline" className="border-ink-foreground/30 text-ink-foreground">
                {course.level}
              </Badge>
            </div>
            <h1 className="font-display mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{course.title}</h1>
            <p className="mt-4 max-w-2xl text-base opacity-90">{course.shortDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm opacity-90">
              <StarRating rating={course.rating} count={course.reviewCount} />
              <span className="inline-flex items-center gap-1.5">
                <Users width={15} height={15} /> {course.students.toLocaleString()} students
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock width={15} height={15} /> {hours} hours · {lessons.length} lessons
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BarChart3 width={15} height={15} /> {course.level}
              </span>
            </div>
            <Link
              to="/instructors/$instructorId"
              params={{ instructorId: instructor.id }}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink-foreground/10 p-2 pr-5 transition-colors hover:bg-ink-foreground/20"
            >
              <img
                src={instructor.photo}
                alt={`Portrait of ${instructor.name}`}
                width={800}
                height={800}
                loading="lazy"
                className="size-10 rounded-full object-cover"
              />
              <span>
                <span className="block text-sm font-semibold">{instructor.name}</span>
                <span className="block text-xs opacity-80">{instructor.title}</span>
              </span>
            </Link>
          </div>

          {/* Sticky enrol card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lift">
              <img
                src={course.image}
                alt={`${course.title} course cover`}
                width={1200}
                height={800}
                className="aspect-[3/2] w-full object-cover"
              />
              <div className="space-y-4 p-6">
                <p className="font-display text-3xl font-semibold">{formatPrice(course.price)}</p>
                {enrolled ? (
                  <Button asChild size="lg" className="w-full rounded-full">
                    <Link to="/learn/$courseId" params={{ courseId: course.id }}>
                      <PlayCircle /> Continue learning
                    </Link>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full rounded-full"
                    onClick={() =>
                      navigate(
                        user
                          ? { to: "/checkout/$courseId", params: { courseId: course.id } }
                          : { to: "/auth", search: { mode: "signup", redirect: `/checkout/${course.id}` } },
                      )
                    }
                  >
                    Enrol now
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => {
                      toggleWishlist(course.id);
                      toast.success(
                        wishlist.includes(course.id) ? "Removed from wishlist" : "Saved to wishlist",
                      );
                    }}
                  >
                    <Heart className={wishlist.includes(course.id) ? "fill-destructive text-destructive" : ""} />
                    Wishlist
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-full" onClick={share}>
                    <Link2 /> Share
                  </Button>
                </div>
                <ul className="space-y-2 border-t pt-4 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ShieldCheck width={15} height={15} className="text-success" /> 30-day money-back
                    guarantee
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck width={15} height={15} className="text-primary" /> Lifetime access +
                    certificate
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Body */}
      <div className="section-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-12">
          <section>
            <h2 className="font-display text-2xl font-semibold">What you'll learn</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-2.5 text-sm">
                  <BadgeCheck width={17} height={17} className="mt-0.5 shrink-0 text-primary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">About this course</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {course.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Curriculum</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {course.modules.length} modules · {lessons.length} lessons · {hours} hours total
            </p>
            <Accordion type="single" collapsible defaultValue="m1" className="mt-5 rounded-2xl border bg-card">
              {course.modules.map((m) => (
                <AccordionItem key={m.id} value={m.id} className="px-5 last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {m.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="divide-y">
                      {m.lessons.map((l) => (
                        <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                          <span className="flex min-w-0 items-center gap-2">
                            <PlayCircle width={15} height={15} className="shrink-0 text-primary" />
                            <span className="truncate">{l.title}</span>
                          </span>
                          <span className="shrink-0 text-xs text-muted-foreground">{l.duration} min</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Requirements</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {course.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Student reviews</h2>
            <div className="mt-5 space-y-4">
              {course.reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border bg-card p-5 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <StarRating rating={r.rating} className="mt-1.5" />
                  <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Questions students ask</h2>
            <Accordion type="single" collapsible className="mt-5 rounded-2xl border bg-card">
              {course.faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="px-5 last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Your instructor</h2>
            <img
              src={instructor.photo}
              alt={`Portrait of ${instructor.name}`}
              width={800}
              height={800}
              loading="lazy"
              className="mt-4 size-20 rounded-2xl object-cover"
            />
            <p className="mt-3 font-semibold">{instructor.name}</p>
            <p className="text-sm text-muted-foreground">{instructor.title}</p>
            <p className="mt-3 text-sm text-muted-foreground">{instructor.shortBio}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {instructor.socials.map((s) => (
                <a key={s.label} href={s.url} className="text-primary hover:text-accent">
                  {s.label}
                </a>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-5 w-full rounded-full">
              <Link to="/instructors/$instructorId" params={{ instructorId: instructor.id }}>
                Full profile
              </Link>
            </Button>
          </div>
          <div className="rounded-2xl border bg-primary-soft p-6">
            <ShieldCheck className="text-primary" />
            <h2 className="mt-3 text-base font-semibold">30-day money-back guarantee</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try the whole course. If it isn't the right fit, email us within thirty days for a full
              refund.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
