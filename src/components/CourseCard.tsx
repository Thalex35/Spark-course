import { Link } from "@tanstack/react-router";
import { Users, Clock } from "lucide-react";
import { StarRating } from "./StarRating";
import { Badge } from "@/components/ui/badge";
import { courseMinutes, getInstructor, type Course } from "@/lib/data";
import { formatPrice } from "@/lib/store";

export function CourseCard({ course }: { course: Course }) {
  const instructor = getInstructor(course.instructorId);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/courses/$courseId"
        params={{ courseId: course.id }}
        className="block aspect-[3/2] overflow-hidden"
        aria-label={`View ${course.title}`}
      >
        <img
          src={course.image}
          alt={`${course.title} course cover`}
          width={1200}
          height={800}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <h3 className="text-lg leading-snug font-semibold">
          <Link to="/courses/$courseId" params={{ courseId: course.id }} className="hover:text-primary">
            {course.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{instructor?.name}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.shortDescription}</p>
        <div className="mt-auto space-y-3 pt-2">
          <StarRating rating={course.rating} count={course.reviewCount} />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users width={13} height={13} /> {course.students.toLocaleString()} students
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock width={13} height={13} /> {Math.round(courseMinutes(course) / 60)}h
            </span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="font-display text-xl font-semibold">{formatPrice(course.price)}</span>
            <Link
              to="/courses/$courseId"
              params={{ courseId: course.id }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              View course
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
