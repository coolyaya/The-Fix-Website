import type { Metadata } from "next";

import { LocationsExplorer } from "@/components/LocationsExplorer";
import locations from "@/data/locations.json";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Browse The Fix locations, view store photos, and search by address or ZIP to find the closest repair shop near you.",
};

export default function LocationsPage() {
  return (
    <main className="container space-y-10 py-10">
      <section className="max-w-2xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Visit The Fix</h1>
        <p className="text-sm text-muted-foreground">
          We have neighborhood shops across the region with certified techs ready for same-day repairs. Search for the closest store, preview photos, and get directions in one tap.
        </p>
      </section>
      <LocationsExplorer locations={locations} />
    </main>
  );
}


