"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MapPinned, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatMiles } from "@/lib/utils";

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  photos: string[];
}

interface LocationCardProps {
  location: Location;
  distanceMiles?: number;
  isActive?: boolean;
  onHover?: (location: Location | null) => void;
  onSelect?: (location: Location) => void;
}

const AUTO_ROTATE_MS = 4000;

export function LocationCard({
  location,
  distanceMiles,
  isActive = false,
  onHover,
  onSelect,
}: LocationCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!location.photos.length) return;
    const id = window.setInterval(() => {
      setPhotoIndex((current) => (current + 1) % location.photos.length);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [location.photos.length]);

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    location.address
  )}`;

  return (
    <Card
      onMouseEnter={() => onHover?.(location)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(location)}
      onBlur={() => onHover?.(null)}
      className={cn(
        "h-full cursor-pointer border-border/60 transition-shadow hover:shadow-lg",
        isActive && "border-brand shadow-lg"
      )}
      onClick={() => onSelect?.(location)}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
    >
      <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
        {location.photos.length ? (
          <Image
            key={location.photos[photoIndex]}
            src={location.photos[photoIndex]}
            alt={`${location.name} storefront`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            Photo coming soon
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {location.photos.map((photo, index) => (
            <span
              key={photo}
              className={cn(
                "h-2 w-2 rounded-full bg-white/40",
                index === photoIndex && "bg-white"
              )}
            />
          ))}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex flex-col gap-1 text-lg">
          <span>{location.name}</span>
          {distanceMiles !== undefined && (
            <span className="text-sm font-medium text-brand">{distanceMiles !== undefined ? formatMiles(distanceMiles) : ""} away</span>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{location.address}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <Phone className="h-4 w-4" aria-hidden="true" />
          <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`} className="hover:text-brand">
            {location.phone}
          </a>
        </p>
        <p>{location.hours}</p>
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={directionsHref} target="_blank" rel="noopener noreferrer">
            <MapPinned className="mr-2 h-4 w-4" />
            Get directions
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}


