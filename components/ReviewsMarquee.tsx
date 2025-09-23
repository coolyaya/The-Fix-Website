interface Review {
  name: string;
  text: string;
}

interface ReviewsMarqueeProps {
  reviews: Review[];
}

export function ReviewsMarquee({ reviews }: ReviewsMarqueeProps) {
  if (!reviews.length) return null;

  const doubled = [...reviews, ...reviews];

  return (
    <section aria-label="Customer reviews" aria-live="off">
      <div className="group relative flex overflow-hidden rounded-3xl border border-border/60 bg-background shadow-soft">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        <div
          className="flex min-w-full animate-marquee items-center gap-6 py-6 transition-[animation-play-state] duration-150 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          tabIndex={0}
          role="list"
          aria-label="Scrolling customer reviews"
        >
          {doubled.map((review, index) => (
            <figure
              key={`${review.name}-${index}`}
              role="listitem"
              tabIndex={0}
              className="w-64 shrink-0 rounded-2xl border border-border/40 bg-muted/40 p-4 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus-visible:ring-fix-blue"
            >
              <blockquote className="text-muted-foreground">"{review.text}"</blockquote>
              <figcaption className="mt-3 font-medium text-foreground">- {review.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
