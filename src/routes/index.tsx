import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarCheck, GraduationCap, PlayCircle, Quote } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/CourseCard";
import { StarRating } from "@/components/StarRating";
import { brand, courses, instructors, testimonials } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Serenity Studio — Coaching & Online Courses for Calmer Living" },
      {
        name: "description",
        content:
          "Enrol in yoga, mindfulness and stress management courses taught by certified coaches. Short lessons, lifetime access, real progress.",
      },
      { property: "og:title", content: "Serenity Studio — Coaching & Online Courses" },
      {
        property: "og:description",
        content: "Yoga, mindfulness and coaching courses with short lessons and lifetime access.",
      },
    ],
  }),
  component: Home,
});

const featured = courses.slice(0, 4);

function Home() {
  const lead = instructors[0]!;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="bg-gradient-hero">
        <div className="section-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              New: Meditation Masterclass is live
            </Badge>
            <h1 className="font-display mt-5 text-4xl leading-[1.08] font-bold sm:text-5xl lg:text-6xl">
              Courses that help people
              <span className="text-primary"> feel better</span>, week by week.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {brand.name} brings certified coaches, therapists and yoga teachers together in one calm
              place. Short guided lessons, honest progress tracking and lifetime access to everything you
              enrol in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/courses">
                  Browse courses <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started free
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["24k+", "Students"],
                ["4.9", "Average rating"],
                ["6", "Signature courses"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-semibold">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Yoga teacher sitting calmly on a mat in a sunlit studio"
              width={1600}
              height={1000}
              className="w-full rounded-3xl object-cover shadow-lift"
            />
            <div className="absolute -bottom-6 left-4 hidden items-center gap-3 rounded-2xl border bg-card p-4 shadow-lift sm:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <PlayCircle />
              </span>
              <div>
                <p className="text-sm font-semibold">15-minute lessons</p>
                <p className="text-xs text-muted-foreground">Made for real schedules</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Value props ---------- */}
      <section className="section-x py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: GraduationCap,
              title: "Taught by practitioners",
              text: "Every course is built by a certified coach, clinician or teacher with years of client work behind it.",
            },
            {
              icon: CalendarCheck,
              title: "Progress you can see",
              text: "Tick off lessons, watch your completion bar move and pick up exactly where you left off.",
            },
            {
              icon: BadgeCheck,
              title: "30-day guarantee",
              text: "If a course isn't right for you, ask for a full refund within thirty days. No forms, no friction.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon width={20} height={20} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Featured courses ---------- */}
      <section className="section-x py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-3xl font-semibold">Featured courses</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our most enrolled programmes this month.
            </p>
          </div>
          <Link
            to="/courses"
            className="shrink-0 text-sm font-medium text-primary hover:text-accent"
          >
            View all
          </Link>
        </div>

        <Carousel opts={{ align: "start" }} className="mt-8">
          <CarouselContent>
            {featured.map((course) => (
              <CarouselItem key={course.id} className="sm:basis-1/2 lg:basis-1/3">
                <CourseCard course={course} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-end gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </section>

      {/* ---------- Meet the coach ---------- */}
      <section className="section-x py-16">
        <div className="grid items-center gap-10 rounded-3xl border bg-card p-6 shadow-soft sm:p-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <img
            src={lead.photo}
            alt={`Portrait of ${lead.name}`}
            width={800}
            height={800}
            loading="lazy"
            className="mx-auto w-full max-w-xs rounded-2xl object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-primary">Meet your lead coach</p>
            <h2 className="font-display mt-2 text-3xl font-semibold">{lead.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{lead.title}</p>
            <StarRating rating={lead.rating} className="mt-3" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{lead.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full">
                <Link to="/instructors/$instructorId" params={{ instructorId: lead.id }}>
                  View profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/contact">Book a session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="bg-secondary/40 py-16">
        <div className="section-x">
          <h2 className="font-display text-3xl font-semibold">What students say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-2xl border bg-card p-6 shadow-soft">
                <Quote width={22} height={22} className="text-primary" />
                <blockquote className="mt-3 text-sm leading-relaxed">{t.text}</blockquote>
                <figcaption className="mt-5 border-t pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <StarRating rating={t.rating} className="mt-2" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section-x py-20">
        <div className="rounded-3xl bg-gradient-brand px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Start with one 15-minute lesson
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-90 sm:text-base">
            Create a free account, enrol in a course and keep lifetime access to every lesson inside it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/auth" search={{ mode: "signup" }}>
                Get started
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
