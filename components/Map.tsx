"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef } from "react";
import mapboxgl, { Map as MapboxMap, Marker } from "mapbox-gl";

import type { Location } from "@/components/LocationCard";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface MapProps {
  locations: Location[];
  selectedId?: string;
  fallbackCenter?: { lat: number; lng: number };
}

export function Map({ locations, selectedId, fallbackCenter }: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center:
        fallbackCenter ?? {
          lng: locations[0]?.lng ?? -73.985664,
          lat: locations[0]?.lat ?? 40.748514,
        },
      zoom: 10.4,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [locations, fallbackCenter]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const existingMarkers = markersRef.current;
    const nextMarkers: Record<string, Marker> = {};

    locations.forEach((location) => {
      let marker = existingMarkers[location.id];
      if (!marker) {
        const element = document.createElement("div");
        marker = new mapboxgl.Marker({ element }).setLngLat([location.lng, location.lat]).addTo(map);
      } else {
        marker.setLngLat([location.lng, location.lat]);
      }

      const el = marker.getElement();
      el.className = `h-3 w-3 rounded-full border-2 border-white shadow transition-transform ${
        selectedId === location.id ? "scale-125 bg-brand" : "bg-brand/60"
      }`;

      nextMarkers[location.id] = marker;
    });

    Object.keys(existingMarkers).forEach((id) => {
      if (!nextMarkers[id]) {
        existingMarkers[id].remove();
      }
    });

    markersRef.current = nextMarkers;
  }, [locations, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const selected = locations.find((location) => location.id === selectedId);
    if (!selected) return;

    map.flyTo({
      center: [selected.lng, selected.lat],
      zoom: 12,
      speed: 0.9,
    });
  }, [locations, selectedId]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-3xl border border-dashed border-border/70 bg-muted/40 text-sm text-muted-foreground">
        Map preview unavailable. Add NEXT_PUBLIC_MAPBOX_TOKEN to enable interactive maps.
      </div>
    );
  }

  return <div ref={containerRef} className="h-full min-h-[360px] w-full overflow-hidden rounded-3xl" />;
}


