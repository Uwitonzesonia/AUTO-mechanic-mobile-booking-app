export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapboxRoute {
  coordinates: LatLng[];
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  formattedDistance: string;
  formattedDuration: string;
  summary?: string;
}

export interface MapboxDirectionsOptions {
  profile?: "driving" | "driving-traffic" | "walking" | "cycling";
  geometries?: "geojson" | "polyline" | "polyline6";
  overview?: "full" | "simplified" | "false";
  steps?: boolean;
  accessToken?: string;
}

const MAPBOX_BASE_URL = "https://api.mapbox.com/directions/v5/mapbox";

function formatDurationText(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Calculates turn-by-turn driving directions between two coordinates via Mapbox Directions API.
 */
export async function getMapboxRoute(
  origin: LatLng,
  destination: LatLng,
  options: MapboxDirectionsOptions = {}
): Promise<MapboxRoute | null> {
  const token =
    options.accessToken ||
    process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

  if (!token) {
    console.warn(
      "[Mapbox] Missing access token. Please define EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment."
    );
    return null;
  }

  const profile = options.profile || "driving";
  const geometries = options.geometries || "geojson";
  const overview = options.overview || "full";
  const steps = options.steps ?? false;

  // Mapbox coordinate format: longitude,latitude
  const coordinatesQuery = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `${MAPBOX_BASE_URL}/${profile}/${coordinatesQuery}?geometries=${geometries}&overview=${overview}&steps=${steps}&access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Mapbox] HTTP ${response.status}:`, errorText);
      return null;
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      return null;
    }

    const route = data.routes[0];
    const rawCoords: [number, number][] = route.geometry?.coordinates || [];

    // Convert GeoJSON [lon, lat] pairs to { latitude, longitude }
    const coordinates: LatLng[] = rawCoords.map(([lon, lat]) => ({
      latitude: lat,
      longitude: lon,
    }));

    const distanceMeters = route.distance ?? 0;
    const distanceKm = Number((distanceMeters / 1000).toFixed(1));
    const durationSeconds = route.duration ?? 0;
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    return {
      coordinates,
      distanceMeters,
      distanceKm,
      durationSeconds,
      durationMinutes,
      formattedDistance: `${distanceKm} km`,
      formattedDuration: formatDurationText(durationMinutes),
      summary: route.legs?.[0]?.summary || "",
    };
  } catch (error) {
    console.warn("[Mapbox] Directions request failed:", error);
    return null;
  }
}
