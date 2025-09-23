"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Slide {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
}

const SLIDES: Slide[] = [
  {
    title: "iPhone 17 drop protection",
    subtitle: "Latest MagSafe-ready cases in stock now with custom colors.",
    image: "/promos/iphone17-feature.svg",
    ctaLabel: "Shop accessories",
    ctaHref: "/services?tab=accessories",
  },
  {
    title: "Student discount week",
    subtitle: "Show a valid ID for 15% off repairs and accessories.",
    image: "/promos/student-discount.svg",
    ctaLabel: "View offers",
    ctaHref: "/about#perks",
  },
  {
    title: "Same-day screen repair",
    subtitle: "Book before 3pm and pick up your phone tonight in most stores.",
    image: "/promos/same-day-repair.svg",
    ctaLabel: "Book a repair",
    ctaHref: "/support",
  },
  {
    title: "Trade-in ready diagnostics",
    subtitle: "Free 15-minute check to prep your device for trade-in or sale.",
    image: "/promos/trade-in-ready.svg",
    ctaLabel: "Schedule visit",
    ctaHref: "/locations",
  },
];

const AUTO_INTERVAL_MS = 6500;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex((previous) => {
      if (index < 0) return SLIDES.length - 1;
      if (index >= SLIDES.length) return 0;
      return typeof index === "number" ? index : previous;
    });
  }, []);

  const next = useCallback(() => {
    setActiveIndex((current) => (current + 1) % SLIDES.length);
  }, []);

  const previous = useCallback(() => {
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(next, AUTO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [next, isPaused]);

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    touchEndX.current = event.touches[0].clientX;
  }

  function onTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (Math.abs(delta) < 40) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }
    if (delta > 0) {
      next();
    } else {
      previous();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-soft"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[460px] w-full">
        {SLIDES.map((slide, index) => (
          <article
            key={slide.title}
            className={cn(
              "absolute inset-0 flex h-full w-full flex-col justify-between gap-6 p-8 transition-all duration-700 md:flex-row",
              index === activeIndex
                ? "translate-x-0 opacity-100"
                : index < activeIndex
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            )}
            aria-hidden={index !== activeIndex}
          >
            <div className="z-10 flex max-w-xl flex-col gap-4 self-end md:self-center">
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80 ring-1 ring-white/20">
                Limited-time promo
              </span>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {slide.title}
              </h2>
              <p className="text-base text-white/80 md:text-lg">{slide.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" variant="default" className="rounded-full bg-white text-neutral-950 hover:bg-white/90">
                  <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="/support">Contact support</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-xl sm:h-64 md:h-full md:w-1/2">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === activeIndex}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-between px-8">
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-2.5 rounded-full transition-all",
                index === activeIndex ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={previous}
            className="pointer-events-auto rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={next}
            className="pointer-events-auto rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </div>
    </section>
  );
}


