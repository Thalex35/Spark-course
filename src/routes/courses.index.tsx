import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, courses } from "@/lib/data";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  maxPrice: z.coerce.number().optional(),
  minRating: z.coerce.number().optional(),
  sort: z.enum(["popular", "newest", "rated", "price-asc", "price-desc"]).optional(),
});

export const Route = createFileRoute("/courses/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Browse Courses — Serenity Studio" },
      {
        name: "description",
        content:
          "Explore yoga, meditation, mental health and business coaching courses. Filter by category, price and rating.",
      },
      { property: "og:title", content: "Browse Courses — Serenity Studio" },
      {
        property: "og:description",
        content: "Filter our full catalog of coaching and wellness courses by category, price and rating.",
      },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { q = "", category = "all", maxPrice = 100, minRating = 0, sort = "popular" } = search;

  const setSearch = (patch: Record<string, unknown>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const visible = useMemo(() => {
    let list = courses.filter((c) => {
      const matchesQuery =
        !q ||
        [c.title, c.shortDescription, c.category].join(" ").toLowerCase().includes(q.toLowerCase());
      const matchesCategory = category === "all" || c.category === category;
      return matchesQuery && matchesCategory && c.price <= maxPrice && c.rating >= minRating;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.publishedAt.localeCompare(a.publishedAt);
        case "rated":
          return b.rating - a.rating;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return b.students - a.students;
      }
    });
    return list;
  }, [q, category, maxPrice, minRating, sort]);

  return (
    <div className="section-x py-12">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold">Browse courses</h1>
        <p className="mt-3 text-muted-foreground">
          Six signature programmes across yoga, meditation, mental health and sustainable performance.
        </p>
      </header>

      <form
        className="mt-8 grid gap-4 rounded-2xl border bg-card p-5 shadow-soft lg:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,180px))]"
        onSubmit={(e) => e.preventDefault()}
        role="search"
      >
        <div>
          <Label htmlFor="course-search" className="text-xs">
            Search
          </Label>
          <div className="relative mt-1.5">
            <Search
              width={15}
              height={15}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="course-search"
              value={q}
              onChange={(e) => setSearch({ q: e.target.value || undefined })}
              placeholder="Try 'yoga' or 'stress'"
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Category</Label>
          <Select value={category} onValueChange={(v) => setSearch({ category: v === "all" ? undefined : v })}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Max price</Label>
          <Select
            value={String(maxPrice)}
            onValueChange={(v) => setSearch({ maxPrice: Number(v) === 100 ? undefined : Number(v) })}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Under $30</SelectItem>
              <SelectItem value="40">Under $40</SelectItem>
              <SelectItem value="50">Under $50</SelectItem>
              <SelectItem value="100">Any price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Rating</Label>
          <Select
            value={String(minRating)}
            onValueChange={(v) => setSearch({ minRating: Number(v) === 0 ? undefined : Number(v) })}
          >
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="4.5">4.5 and up</SelectItem>
              <SelectItem value="4.8">4.8 and up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Sort by</Label>
          <Select value={sort} onValueChange={(v) => setSearch({ sort: v === "popular" ? undefined : v })}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rated">Best rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <SlidersHorizontal width={14} height={14} className="mr-1 inline" />
          {visible.length} course{visible.length === 1 ? "" : "s"} found
        </p>
        <Button variant="ghost" size="sm" onClick={() => navigate({ search: {} })}>
          Reset filters
        </Button>
      </div>

      {visible.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          No courses match those filters yet. Try widening your search.
        </p>
      )}
    </div>
  );
}
