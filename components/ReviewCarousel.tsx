"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface Review {
  name: string;
  text: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

const AUTO_INTERVAL_MS = 2000;
const TRANSITION_MS = 500;

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const reviewCount = reviews.length;

  const goTo = useCallback(
    (index: number) => {
      if (!reviewCount) return;
      setActiveIndex((current) => {
        const target = ((index % reviewCount) + reviewCount) % reviewCount;
        return target === current ? current : target;
      });
    },
    [reviewCount],
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const previous = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (!reviewCount || isPaused) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviewCount);
    }, AUTO_INTERVAL_MS);
  }, [clearTimer, isPaused, reviewCount]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  useEffect(() => {
    startTimer();
  }, [isPaused, startTimer]);

  function handleMouseEnter() {
    setPaused(true);
  }

  function handleMouseLeave() {
    setPaused(false);
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchCurrentX.current = touchStartX.current;
    setPaused(true);
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    touchCurrentX.current = event.touches[0]?.clientX ?? null;
  }

  function onTouchEnd() {
    if (touchStartX.current !== null && touchCurrentX.current !== null) {
      const delta = touchStartX.current - touchCurrentX.current;
      if (Math.abs(delta) > 40) {
        if (delta > 0) {
          next();
        } else {
          previous();
        }
      }
    }
    touchStartX.current = null;
    touchCurrentX.current = null;
    setPaused(false);
  }

  if (!reviewCount) {
    return null;
  }

  return (
    <section className="py-16 md:py-24" aria-label="Customer review carousel">
      <div
        className="group relative overflow-hidden rounded-3xl bg-white py-12 shadow-soft"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative mx-auto max-w-3xl px-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-wide text-fix-blue">Real 5-Star Reviews</div>
          <div className="relative mt-6 min-h-[180px]">
            {reviews.map((review, index) => (
              <figure
                key={`${review.name}-${index}`}
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center gap-4 px-2 text-lg text-fix-slate transition-all ease-out",
                  index === activeIndex
                    ? "translate-x-0 opacity-100"
                    : index < activeIndex
                    ? "-translate-x-full opacity-0"
                    : "translate-x-full opacity-0",
                )}
                style={{ transitionDuration: `${TRANSITION_MS}ms` }}
                aria-hidden={index !== activeIndex}
              >
                <blockquote className="text-balance text-xl text-fix-navy md:text-2xl">
                  "{review.text}"
                </blockquote>
                <figcaption className="text-sm font-medium text-fix-blue">- {review.name}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "h-2.5 rounded-full bg-fix-blue/30 transition-all duration-200",
                  index === activeIndex ? "w-6 bg-fix-blue" : "w-2.5 hover:bg-fix-pink/60",
                )}
                onClick={() => goTo(index)}
                aria-label={`Go to review ${index + 1}`}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
