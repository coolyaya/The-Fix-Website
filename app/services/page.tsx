import { Metadata } from "next";
import { notFound } from "next/navigation";

import { RepairsAccessoriesTabs } from "@/components/RepairsAccessoriesTabs";
import accessories from "@/data/accessories.json";
import repairs from "@/data/repairs.json";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore The Fix repair menu and curated accessories. Same-day repairs for phones, tablets, laptops, and consoles plus gear handpicked by our techs.",
};

interface ServicesPageProps {
  searchParams?: { tab?: string };
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  const tab = searchParams?.tab === "accessories" ? "accessories" : "repairs";

  if (!repairs.length) {
    notFound();
  }

  return (
    <main className="container space-y-10 py-10">
      <section className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Repairs & accessories</h1>
        <p className="text-sm text-muted-foreground">
          Book same-day repairs with certified technicians. Search by device, compare typical turnaround times, and browse accessories that keep your tech running smarter.
        </p>
      </section>
      <RepairsAccessoriesTabs repairs={repairs} accessories={accessories} defaultTab={tab} />
    </main>
  );
}


