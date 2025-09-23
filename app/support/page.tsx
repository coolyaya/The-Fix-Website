import type { Metadata } from "next";

import { SupportChat } from "@/components/SupportChat";
import { TicketForm } from "@/components/TicketForm";
import locations from "@/data/locations.json";
import repairs from "@/data/repairs.json";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Contact The Fix support team. Chat with the AI concierge for quick answers or submit a ticket for device repairs and follow-up.",
};

const categories = Array.from(
  new Set(
    repairs.flatMap((entry) => entry.issues.map((issue) => issue.name))
  )
).sort();

const locationOptions = locations.map((location) => ({ id: location.id, name: location.name }));

export default function SupportPage() {
  return (
    <main className="container space-y-10 py-10">
      <section className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">We are here to help</h1>
        <p className="text-sm text-muted-foreground">
          Ask FixBot for quick answers or open a ticket and we will follow up with next steps. We typically reply within one business hour during store operating times.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <SupportChat />
        <TicketForm categories={categories} locations={locationOptions} />
      </div>
    </main>
  );
}


