import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 3958.75; // miles
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2) ** 2;
  const sinLng = Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(
    Math.sqrt(sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng),
    Math.sqrt(1 - (sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng))
  );

  return R * c;
}

export function formatMiles(value: number) {
  if (!Number.isFinite(value)) return "";
  if (value < 1) {
    return `${Math.round(value * 10) / 10} mi`;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} mi`;
}


