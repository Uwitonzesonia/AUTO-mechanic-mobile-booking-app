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
export function getDistanceBetween(origin: LatLng, destination: LatLng): number {
  const R = 6371000;
  const dLat = ((destination.latitude - origin.latitude) * Math.PI) / 180;
  const dLon = ((destination.longitude - origin.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.latitude * Math.PI) / 180) *
      Math.cos((destination.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateRouteWaypoints(
  origin: LatLng,
  destination: LatLng,
  numPoints: number = 24
): LatLng[] {
  const points: LatLng[] = [];

  const corner1: LatLng = {
    latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.15,
    longitude: origin.longitude + (destination.longitude - origin.longitude) * 0.65,
  };

  const corner2: LatLng = {
    latitude: origin.latitude + (destination.latitude - origin.latitude) * 0.85,
    longitude: corner1.longitude,
  };

  const keyPoints = [origin, corner1, corner2, destination];
  const segmentsCount = keyPoints.length - 1;
  const pointsPerSegment = Math.floor((numPoints - 1) / segmentsCount);

  for (let s = 0; s < segmentsCount; s++) {
    const start = keyPoints[s];
    const end = keyPoints[s + 1];
    const count =
      s === segmentsCount - 1
        ? numPoints - points.length - 1
        : pointsPerSegment;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      points.push({
        latitude: start.latitude + t * (end.latitude - start.latitude),
        longitude: start.longitude + t * (end.longitude - start.longitude),
      });
    }
  }

  points.push(destination);
  return points;
}

export function createSimulatedRoute(
  origin: LatLng,
  destination: LatLng
): MapboxRoute {
  const directMeters = getDistanceBetween(origin, destination);
  const distanceMeters = Math.max(50, Math.round(directMeters * 1.2));
  const distanceKm = Number((distanceMeters / 1000).toFixed(1));
  const durationMinutes = Math.max(1, Math.round(distanceMeters / 250));

  const coordinates = generateRouteWaypoints(origin, destination, 24);

  return {
    coordinates,
    distanceMeters,
    distanceKm,
    durationSeconds: durationMinutes * 60,
    durationMinutes,
    formattedDistance: `${distanceKm} km`,
    formattedDuration: formatDurationText(durationMinutes),
    summary: "City Route",
  };
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
    return createSimulatedRoute(origin, destination);
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
      return createSimulatedRoute(origin, destination);
    }

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) {
      return createSimulatedRoute(origin, destination);
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
    console.warn("[Mapbox] Directions request failed, using simulated route:", error);
    return createSimulatedRoute(origin, destination);
  }
}
