import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PromoBadge } from "@/components/PromoBadge";
import { ReviewsMarquee } from "@/components/ReviewsMarquee";
import accessories from "@/data/accessories.json";
import repairs from "@/data/repairs.json";
import reviews from "@/data/reviews.json";

const popularRepairs = repairs.slice(0, 4);
const featuredAccessories = accessories.slice(0, 6);

export default function HomePage() {
  return (
    <main className="container space-y-16 py-10">
      <section className="space-y-6">
        <PromoBadge>Certified techs | Same-day service | Lifetime workmanship warranty</PromoBadge>
        <HeroCarousel />
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full" size="lg">
            <Link href="/support">Book a repair</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full" size="lg">
            <Link href="/locations">Find a location</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full" size="lg">
            <Link href="/support">Contact support</Link>
          </Button>
        </div>
      </section>

      <ReviewsMarquee reviews={reviews} />

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Popular repairs</h2>
            <p className="text-sm text-muted-foreground">
              Transparent pricing and genuine parts for phones, tablets, laptops, and more.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/services">See all services</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {popularRepairs.map((entry) => (
            <Card key={`${entry.brand}-${entry.category}`} className="border-border/60">
              <CardHeader>
                <CardTitle className="flex flex-col gap-1 text-xl">
                  <span>
                    {entry.brand} {entry.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Models: {entry.models.join(", ")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {entry.issues.slice(0, 3).map((issue) => (
                  <div
                    key={issue.name}
                    className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3"
                  >
                    <span className="font-medium text-foreground">{issue.name}</span>
                    <span className="text-xs uppercase tracking-wide text-brand">
                      from ${issue.startsAt} - {issue.eta}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Featured accessories</h2>
            <p className="text-sm text-muted-foreground">
              Curated gear our techs love from cases to chargers, audio, and protection.
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/services?tab=accessories">Shop accessories</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredAccessories.map((item) => (
            <Card key={item.name} className="border-border/60">
              <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-muted/40">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.priceRange}</p>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>Highlights: {item.tags.join(", ")}</p>
                {item.compatible?.length ? (
                  <p>Compatible with {item.compatible.join(", ")}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}


