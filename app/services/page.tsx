import { Metadata } from "next";

import { ServicesDirectory } from "@/components/ServicesDirectory";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore The Fix repair catalog. Compare turnaround times, warranties, and transparent pricing across phones, tablets, laptops, consoles, and more.",
};

export default function ServicesPage() {
  return (
    <main className="container space-y-10 py-10">
      <section className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Certified repairs & upgrades</h1>
        <p className="text-sm text-muted-foreground">
          Browse our most-requested repairs, diagnostics, and device services. Pricing stays fixed regardless of which location you visit, and every repair includes the warranty shown on each card.
        </p>
      </section>
      <ServicesDirectory services={services} />
    </main>
  );
}
