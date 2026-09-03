import * as Location from "expo-location";
import type { Mechanic } from "@/types/mechanic";

export interface UserCoordinates {
    latitude: number;
    longitude: number;
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
}

/**
 * Offsets for distributing 10 mechanics around any given user location
 * (Distance ranges from ~0.8km to ~6.5km)
 */
const MECHANIC_OFFSETS = [
    { dLat: 0.0072, dLon: 0.0051 },  // ~0.9 km NE (Closest)
    { dLat: -0.0065, dLon: 0.0084 }, // ~1.2 km SE
    { dLat: 0.0091, dLon: -0.0075 }, // ~1.5 km NW
    { dLat: -0.0120, dLon: -0.0062 },// ~1.8 km SW
    { dLat: 0.0145, dLon: 0.0110 },  // ~2.3 km NE (Top 5 closest)
    { dLat: -0.0180, dLon: 0.0165 }, // ~3.1 km SE
    { dLat: 0.0220, dLon: -0.0190 }, // ~3.8 km NW
    { dLat: -0.0265, dLon: -0.0230 },// ~4.6 km SW
    { dLat: 0.0310, dLon: 0.0270 },  // ~5.4 km NE
    { dLat: -0.0380, dLon: 0.0320 }, // ~6.5 km SE
];

/**
 * Places the mechanics around the user's location, calculates their distances,
 * and sorts them so the closest ones appear first.
 */
export function getNearbyMechanics(
    userLat: number,
    userLon: number,
    mechanics: Mechanic[],
    limit?: number
): Mechanic[] {
    const localized = mechanics.map((m, index) => {
        const offset = MECHANIC_OFFSETS[index % MECHANIC_OFFSETS.length];
        const mLat = userLat + offset.dLat;
        const mLon = userLon + offset.dLon;
        const distance = calculateDistanceKm(userLat, userLon, mLat, mLon);

        return {
            ...m,
            current_location: {
                lat: mLat,
                lon: mLon,
                distanceKm: distance,
            },
            location: {
                lat: mLat,
                lon: mLon,
                distanceKm: distance,
            },
        };
    });

    // Sort by distance
    localized.sort((a, b) => {
        const distA = a.current_location?.distanceKm ?? 999;
        const distB = b.current_location?.distanceKm ?? 999;
        return distA - distB;
    });

    return typeof limit === "number" ? localized.slice(0, limit) : localized;
}

let cachedUserCoords: UserCoordinates | null = null;

export function getCachedUserLocation(): UserCoordinates | null {
    return cachedUserCoords;
}

export function setCachedUserLocation(coords: UserCoordinates | null): void {
    cachedUserCoords = coords;
}

/**
 * Request location permissions and fetch current device coordinates.
 * Queries last known position first for instant responsiveness, then current position.
 */
export async function getCurrentUserLocation(): Promise<UserCoordinates | null> {
    try {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
            const permissionRes = await Location.requestForegroundPermissionsAsync();
            status = permissionRes.status;
        }

        if (status !== "granted") {
            return null;
        }

        // Try getting last known position first for quick responsiveness
        try {
            const lastKnown = await Location.getLastKnownPositionAsync({});
            if (lastKnown?.coords) {
                const quickCoords: UserCoordinates = {
                    latitude: lastKnown.coords.latitude,
                    longitude: lastKnown.coords.longitude,
                };
                cachedUserCoords = quickCoords;
            }
        } catch {
            // Ignore and proceed to getCurrentPositionAsync
        }

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        if (position?.coords) {
            const freshCoords: UserCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            cachedUserCoords = freshCoords;
            return freshCoords;
        }

        return cachedUserCoords;
    } catch (error) {
        console.warn("Could not retrieve user location:", error);
        return cachedUserCoords;
    }
}
