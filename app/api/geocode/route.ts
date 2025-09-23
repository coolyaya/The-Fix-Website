import { NextResponse } from "next/server";

import locations from "@/data/locations.json";
import { geocode } from "@/lib/geocode";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const buckets = new Map<string, { count: number; reset: number }>();

function rateLimit(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }
  bucket.count += 1;
  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ message: "Supply a query" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (!rateLimit(ip)) {
    return NextResponse.json({ message: "Too many requests. Try again soon." }, { status: 429 });
  }

  const coordinates = await geocode(query);
  if (coordinates) {
    return NextResponse.json({ coordinates, source: "geocoding" });
  }

  const fallback = locations.find((location) =>
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.address.toLowerCase().includes(query.toLowerCase())
  );

  if (fallback) {
    return NextResponse.json({
      coordinates: { lat: fallback.lat, lng: fallback.lng },
      source: "fallback",
      message: "Using an approximate match from known store locations.",
    });
  }

  return NextResponse.json(
    { message: "No coordinates found for that search." },
    { status: 404 }
  );
}


