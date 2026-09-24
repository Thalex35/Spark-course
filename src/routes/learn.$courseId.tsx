import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Download,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { courseLessons, getCourse } from "@/lib/data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn/$courseId")({
  validateSearch: z.object({ lesson: z.string().optional() }),
  loader: ({ params }) => {
    const course = getCourse(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Lesson unavailable — Serenity Studio" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `Learning: ${loaderData.course.title} — Serenity Studio` },
        { name: "description", content: `Watch lessons and track progress in ${loaderData.course.title}.` },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: CoursePlayer,
});

function CoursePlayer() {
  const { course } = Route.useLoaderData();
  const { lesson: lessonParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { isEnrolled, isLessonComplete, toggleLesson, progress, completedCount, touchCourse, ready, user } =
    useApp();

  const lessons = courseLessons(course);
  const currentIndex = Math.max(
    0,
    lessons.findIndex((l) => l.id === lessonParam),
  );
  const current = lessons[currentIndex]!;
  const currentModule = course.modules.find((m) => m.lessons.some((l) => l.id === current.id))!;
  const done = isLessonComplete(course.id, current.id);
  const pct = progress(course.id);

  useEffect(() => {
    if (ready && isEnrolled(course.id)) touchCourse(course.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, course.id]);

  if (!ready) return <div className="section-x py-24 text-muted-foreground">Loading course…</div>;

  if (!user || !isEnrolled(course.id)) {
    return (
      <div className="section-x py-24 text-center">
        <Lock className="mx-auto text-primary" />
        <h1 className="font-display mt-4 text-3xl font-semibold">Enrol to start learning</h1>
        <p className="mt-3 text-muted-foreground">
          Lessons for {course.title} unlock as soon as you enrol.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/courses/$courseId" params={{ courseId: course.id }}>
            View course details
          </Link>
        </Button>
      </div>
    );
  }

  const goTo = (index: number) => {
    const target = lessons[index];
    if (target) navigate({ search: { lesson: target.id } });
  };

  return (
    <div className="section-x py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft width={15} height={15} /> Back to dashboard
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Player */}
        <div>
          <div className="relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-ink text-ink-foreground">
            <img
              src={course.image}
              alt={`${course.title} lesson preview`}
              width={1200}
              height={800}
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <button
              type="button"
              onClick={() => toast("This is a demo player — plug in your video host here.")}
              className="relative grid size-20 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
              aria-label={`Play ${current.title}`}
            >
              <PlayCircle width={34} height={34} />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-xs">
              {current.duration}:00
            </span>
          </div>

          <p className="mt-6 text-xs font-semibold tracking-wide text-primary uppercase">
            {currentModule.title} · Lesson {currentIndex + 1} of {lessons.length}
          </p>
          <h1 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">{current.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            In this {current.duration}-minute lesson you'll follow along step by step. Take it slowly, pause
            whenever you need to, and repeat the session as often as you like — you have lifetime access.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full"
              variant={done ? "secondary" : "default"}
              onClick={() => {
                toggleLesson(course.id, current.id);
                toast.success(done ? "Marked as not complete" : "Lesson complete — nice work!");
              }}
            >
              {done ? <Check /> : <CircleDot />} {done ? "Completed" : "Mark as complete"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
            >
              <ChevronLeft /> Previous
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              disabled={currentIndex === lessons.length - 1}
              onClick={() => goTo(currentIndex + 1)}
            >
              Next <ChevronRight />
            </Button>
          </div>

          <section className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <FileText width={17} height={17} className="text-primary" /> Lesson resources
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                {["Lesson workbook (PDF)", "Audio-only version (MP3)", "Practice checklist (PDF)"].map(
                  (r) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => toast("Attach your real files here in the template.")}
                        className="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left hover:bg-muted"
                      >
                        <span className="truncate">{r}</span>
                        <Download width={15} height={15} className="shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="text-base font-semibold">My notes</h2>
              <Textarea
                className="mt-4 min-h-32"
                placeholder="Jot down a timestamp or a reflection…"
                aria-label="Lesson notes"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-full"
                onClick={() => toast.success("Note saved for this lesson")}
              >
                Save note
              </Button>
            </div>
          </section>
        </div>

        {/* Curriculum sidebar */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold">{course.title}</h2>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-medium">{pct}% complete</span>
              <span className="text-muted-foreground">
                {completedCount(course.id)}/{lessons.length} lessons
              </span>
            </div>
            <Progress value={pct} className="mt-2" />

            <div className="mt-5 space-y-5">
              {course.modules.map((m) => (
                <div key={m.id}>
                  <h3
                    className={cn(
                      "text-xs font-semibold tracking-wide uppercase",
                      m.id === currentModule.id ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {m.title}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {m.lessons.map((l) => {
                      const complete = isLessonComplete(course.id, l.id);
                      const active = l.id === current.id;
                      return (
                        <li key={l.id}>
                          <button
                            type="button"
                            onClick={() => navigate({ search: { lesson: l.id } })}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                              active ? "bg-primary-soft font-medium" : "hover:bg-muted",
                            )}
                            aria-current={active ? "true" : undefined}
                          >
                            {complete ? (
                              <Check width={15} height={15} className="shrink-0 text-success" />
                            ) : (
                              <PlayCircle width={15} height={15} className="shrink-0 text-muted-foreground" />
                            )}
                            <span className="min-w-0 flex-1 truncate">{l.title}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">{l.duration}m</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
