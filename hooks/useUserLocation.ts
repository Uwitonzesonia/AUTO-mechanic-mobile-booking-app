import { useEffect, useState, useCallback } from "react";
import { getCurrentUserLocation, getNearbyMechanics, UserCoordinates } from "@/utils/location";
import { MOCK_MECHANICS } from "@/constants/mechanics";
import type { Mechanic } from "@/types/mechanic";

// Default fallback coordinates (e.g., Dallas / City center)
const DEFAULT_COORDS: UserCoordinates = {
    latitude: 32.7767,
    longitude: -96.7970,
};

export function useUserLocation(mechanicsLimit: number = 5) {
    const [userCoords, setUserCoords] = useState<UserCoordinates>(DEFAULT_COORDS);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [nearbyMechanics, setNearbyMechanics] = useState<Mechanic[]>(() =>
        getNearbyMechanics(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, MOCK_MECHANICS, mechanicsLimit)
    );

    const refreshLocation = useCallback(async () => {
        setIsLoading(true);
        const coords = await getCurrentUserLocation();
        if (coords) {
            setUserCoords(coords);
            setHasPermission(true);
            setNearbyMechanics(
                getNearbyMechanics(coords.latitude, coords.longitude, MOCK_MECHANICS, mechanicsLimit)
            );
        } else {
            setHasPermission(false);
            // Fallback to default coordinates with localized mechanics
            setNearbyMechanics(
                getNearbyMechanics(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude, MOCK_MECHANICS, mechanicsLimit)
            );
        }
        setIsLoading(false);
    }, [mechanicsLimit]);

    useEffect(() => {
        refreshLocation();
    }, [refreshLocation]);

    return {
        userCoords,
        hasPermission,
        isLoading,
        nearbyMechanics,
        refreshLocation,
    };
}

export default useUserLocation;
