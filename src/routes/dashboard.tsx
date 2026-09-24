import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, BookOpen, Clock, PlayCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseCard } from "@/components/CourseCard";
import { courseLessons, courses, getCourse, getInstructor } from "@/lib/data";
import { formatDate, useApp } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard — Serenity Studio" },
      {
        name: "description",
        content: "Track your enrolled courses, progress and learning hours in one place.",
      },
      { property: "og:title", content: "Your Dashboard — Serenity Studio" },
      { property: "og:description", content: "Continue learning and see how far you've come." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, enrollments, progress, completedCount, minutesLearned, ready } = useApp();

  if (!ready) return <div className="section-x py-24 text-muted-foreground">Loading your dashboard…</div>;

  if (!user) {
    return (
      <div className="section-x py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Sign in to see your dashboard</h1>
        <p className="mt-3 text-muted-foreground">
          Your enrolled courses and progress live here once you have an account.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/auth">Sign in</Link>
        </Button>
      </div>
    );
  }

  const enrolled = enrollments
    .map((e) => ({ ...e, course: getCourse(e.courseId)! }))
    .filter((e) => e.course);
  const overall = enrolled.length
    ? Math.round(enrolled.reduce((sum, e) => sum + progress(e.courseId), 0) / enrolled.length)
    : 0;
  const recommended = courses.filter((c) => !enrollments.some((e) => e.courseId === c.id)).slice(0, 3);
  const minutes = minutesLearned();

  return (
    <div className="section-x py-12">
      <header>
        <p className="text-sm font-semibold text-primary">Welcome back</p>
        <h1 className="font-display mt-1 text-4xl font-semibold">{user.name}</h1>
        <p className="mt-3 text-muted-foreground">
          {enrolled.length
            ? "Pick up where you left off — small sessions add up."
            : "You haven't enrolled in a course yet. Browse the catalog to get started."}
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: BookOpen, label: "Courses enrolled", value: enrolled.length },
          { icon: TrendingUp, label: "Overall completion", value: `${overall}%` },
          {
            icon: Clock,
            label: "Hours learning",
            value: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <Icon width={18} height={18} />
            </span>
            <p className="font-display mt-3 text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">My courses</h2>
        {enrolled.length ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {enrolled.map(({ course, lastAccessed }) => {
              const total = courseLessons(course).length;
              const pct = progress(course.id);
              return (
                <article
                  key={course.id}
                  className="grid gap-4 rounded-2xl border bg-card p-4 shadow-soft sm:grid-cols-[140px_minmax(0,1fr)]"
                >
                  <img
                    src={course.image}
                    alt={`${course.title} course cover`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-32 w-full rounded-xl object-cover sm:h-full"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {getInstructor(course.instructorId)?.name}
                    </p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{pct}% complete</span>
                        <span className="text-muted-foreground">
                          {completedCount(course.id)}/{total} lessons
                        </span>
                      </div>
                      <Progress value={pct} className="mt-2" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Last opened {formatDate(lastAccessed)}
                    </p>
                    <Button asChild size="sm" className="mt-3 rounded-full">
                      <Link to="/learn/$courseId" params={{ courseId: course.id }}>
                        <PlayCircle /> Continue learning
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed p-10 text-center">
            <Sparkles className="mx-auto text-primary" />
            <p className="mt-3 text-muted-foreground">Your first course is one click away.</p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="mt-12 rounded-2xl border bg-secondary/40 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BellRing width={18} height={18} className="text-primary" /> Updates
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
          <li>New bonus lesson added to Meditation Masterclass: “Working with restlessness”.</li>
          <li>Live Q&amp;A with Emma Rodriguez next Thursday at 6pm.</li>
          <li>Your certificate for any completed course is ready in your profile.</li>
        </ul>
      </section>

      {recommended.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Recommended for you</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
