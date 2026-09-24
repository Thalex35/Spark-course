import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Leaf, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { brand, instructors } from "@/lib/data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Serenity Studio — Our Coaches & Approach" },
      {
        name: "description",
        content:
          "Meet the certified coaches behind Serenity Studio and the teaching approach that keeps students coming back.",
      },
      { property: "og:title", content: "About Serenity Studio" },
      {
        property: "og:description",
        content: "Certified coaches, short lessons and a calm approach to learning.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="section-x py-14">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">About {brand.name}</h1>
        <p className="mt-5 text-muted-foreground">
          We started {brand.name} because good coaching shouldn't depend on living near a good studio. Our
          teachers are practitioners first — clinicians, certified yoga teachers and working coaches who
          bring years of client experience into short, well-produced lessons.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: Leaf,
            title: "Calm over hustle",
            text: "No streak-shaming, no guilt. Fifteen honest minutes beats an hour you dread.",
          },
          {
            icon: Users,
            title: "Practitioners only",
            text: "Every course is authored by someone who does this work with real clients every week.",
          },
          {
            icon: Heart,
            title: "Care after purchase",
            text: "Lifetime access, live Q&As and a thirty-day guarantee on everything we publish.",
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
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-semibold">Our coaches</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {instructors.map((i) => (
            <article key={i.id} className="rounded-2xl border bg-card p-6 shadow-soft">
              <img
                src={i.photo}
                alt={`Portrait of ${i.name}`}
                width={800}
                height={800}
                loading="lazy"
                className="size-24 rounded-2xl object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{i.name}</h3>
              <p className="text-sm text-muted-foreground">{i.title}</p>
              <StarRating rating={i.rating} className="mt-2" />
              <p className="mt-3 text-sm text-muted-foreground">{i.shortBio}</p>
              <Button asChild variant="outline" size="sm" className="mt-5 rounded-full">
                <Link to="/instructors/$instructorId" params={{ instructorId: i.id }}>
                  View profile
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-gradient-brand px-6 py-12 text-center text-primary-foreground">
        <h2 className="font-display text-3xl font-semibold">Ready to start?</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm opacity-90">
          Browse the catalog and enrol in the course that matches where you are today.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-7 rounded-full">
          <Link to="/courses">Browse courses</Link>
        </Button>
      </section>
    </div>
  );
}
