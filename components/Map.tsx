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
        element.classList.add("mapboxgl-marker", "mapboxgl-marker-anchor-center");
        const dot = document.createElement("span");
        dot.setAttribute("data-role", "marker-dot");
        element.appendChild(dot);

        marker = new mapboxgl.Marker({ element, anchor: "center" })
          .setLngLat([location.lng, location.lat])
          .addTo(map);
      } else {
        marker.setLngLat([location.lng, location.lat]);
      }

      const element = marker.getElement() as HTMLDivElement;
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";
      element.style.pointerEvents = "none";

      let dot = element.querySelector<HTMLSpanElement>("[data-role='marker-dot']");
      if (!dot) {
        dot = document.createElement("span");
        dot.setAttribute("data-role", "marker-dot");
        element.appendChild(dot);
      }

      const isSelected = selectedId === location.id;
      const size = isSelected ? 18 : 14;

      dot.style.display = "block";
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.borderRadius = "9999px";
      dot.style.backgroundColor = isSelected ? "rgb(255, 79, 191)" : "rgba(47, 87, 209, 0.92)";
      dot.style.border = "2px solid #ffffff";
      dot.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.25)";
      dot.style.transition = "transform 150ms ease, background-color 150ms ease, width 150ms ease, height 150ms ease";
      dot.style.transform = isSelected ? "scale(1.12)" : "scale(1)";

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

