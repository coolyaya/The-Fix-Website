export interface Coordinates {
  lat: number;
  lng: number;
}

async function geocodeWithMapbox(query: string, token: string): Promise<Coordinates | null> {
  const searchParams = new URLSearchParams({
    access_token: token,
    limit: "1",
    proximity: "-73.985664,40.748514",
  });

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    console.error("Mapbox geocode error", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as {
    features?: Array<{ center?: [number, number] }>;
  };

  const feature = data.features?.[0];
  if (!feature?.center) {
    return null;
  }

  return { lng: feature.center[0], lat: feature.center[1] };
}

async function geocodeWithGoogle(query: string, token: string): Promise<Coordinates | null> {
  const searchParams = new URLSearchParams({
    address: query,
    key: token,
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    console.error("Google geocode error", response.status, await response.text());
    return null;
  }

  const data = (await response.json()) as {
    results?: Array<{ geometry?: { location?: { lat: number; lng: number } } }>;
    status?: string;
  };

  if (data.status !== "OK" || !data.results?.length) {
    return null;
  }

  const location = data.results[0]?.geometry?.location;
  if (!location) {
    return null;
  }

  return { lat: location.lat, lng: location.lng };
}

export async function geocode(query: string): Promise<Coordinates | null> {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const mapboxToken = process.env.MAPBOX_TOKEN;
  if (mapboxToken) {
    return geocodeWithMapbox(trimmed, mapboxToken);
  }

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;
  if (googleKey) {
    return geocodeWithGoogle(trimmed, googleKey);
  }

  return null;
}


