"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LocationCard, type Location } from "@/components/LocationCard";
import { Map } from "@/components/Map";
import { haversineDistance } from "@/lib/utils";

interface LocationsExplorerProps {
  locations: Location[];
}

interface AugmentedLocation extends Location {
  distance?: number;
}

export function LocationsExplorer({ locations }: LocationsExplorerProps) {
  const [searchValue, setSearchValue] = useState("");
  const [items, setItems] = useState<AugmentedLocation[]>(locations);
  const [selectedId, setSelectedId] = useState<string>(locations[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locations.length && !selectedId) {
      setSelectedId(locations[0].id);
    }
  }, [locations, selectedId]);

  const nearestText = useMemo(() => {
    if (!items.length || items[0].distance === undefined) return "";
    return `Nearest stores to your search`;
  }, [items]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!searchValue.trim()) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchValue)}`);
      if (!response.ok) {
        throw new Error(`Geocode request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        coordinates?: { lat: number; lng: number };
        message?: string;
      };

      if (!data.coordinates) {
        setError(data.message ?? "Could not locate that address. Try another city or ZIP.");
        setIsLoading(false);
        return;
      }

      const distances = locations
        .map((location) => ({
          ...location,
          distance: haversineDistance(data.coordinates!, { lat: location.lat, lng: location.lng }),
        }))
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
        .slice(0, 5);

      setItems(distances);
      if (distances.length) {
        setSelectedId(distances[0].id);
      }
    } catch (error) {
      console.error("Location search error", error);
      setError("We could not search that location. Please try again shortly.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <Card className="border-border/60">
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl font-semibold">Find a store</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your city, ZIP, or neighborhood to see the closest locations. We will calculate the five nearest stores.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Enter address or ZIP"
              aria-label="Search address or ZIP"
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
          {nearestText ? <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{nearestText}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          {items.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              distanceMiles={location.distance}
              isActive={location.id === selectedId}
              onSelect={(loc) => setSelectedId(loc.id)}
              onHover={(loc) => loc && setSelectedId(loc.id)}
            />
          ))}
        </div>
        <div className="sticky top-24 h-full min-h-[420px]">
          <Map
            locations={locations}
            selectedId={selectedId}
            fallbackCenter={{ lat: locations[0]?.lat ?? 40.7549, lng: locations[0]?.lng ?? -73.984 }}
          />
        </div>
      </div>
    </div>
  );
}


