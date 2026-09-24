import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  count?: number;
  className?: string;
  size?: number;
};

/** Accessible star rating display. */
export function StarRating({ rating, count, className, size = 14 }: Props) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            width={size}
            height={size}
            className={cn(
              "shrink-0",
              i <= Math.round(rating) ? "fill-star text-star" : "fill-transparent text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count.toLocaleString()})</span>
      )}
      <span className="sr-only">{rating.toFixed(1)} out of 5 stars</span>
    </span>
  );
}
