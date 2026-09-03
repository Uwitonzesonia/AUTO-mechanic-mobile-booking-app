import { useEffect, useState, useCallback, useRef } from "react";
import * as Location from "expo-location";
import {
    getCurrentUserLocation,
    getCachedUserLocation,
    setCachedUserLocation,
    getNearbyMechanics,
    UserCoordinates,
} from "@/utils/location";
import { MOCK_MECHANICS } from "@/constants/mechanics";
import type { Mechanic } from "@/types/mechanic";

export function useUserLocation(mechanicsLimit: number = 5) {
    const initialCoords = getCachedUserLocation();
    const [userCoords, setUserCoords] = useState<UserCoordinates | null>(initialCoords);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(!initialCoords);
    const [nearbyMechanics, setNearbyMechanics] = useState<Mechanic[]>(() =>
        initialCoords
            ? getNearbyMechanics(initialCoords.latitude, initialCoords.longitude, MOCK_MECHANICS, mechanicsLimit)
            : []
    );

    const isMountedRef = useRef(true);

    const refreshLocation = useCallback(async () => {
        setIsLoading(true);

        try {
            let { status } = await Location.getForegroundPermissionsAsync();
            if (status !== "granted") {
                const req = await Location.requestForegroundPermissionsAsync();
                status = req.status;
            }

            if (status !== "granted") {
                if (isMountedRef.current) {
                    setHasPermission(false);
                    setIsLoading(false);
                }
                return;
            }

            if (isMountedRef.current) {
                setHasPermission(true);
            }

            // Fast path: check last known position first
            try {
                const lastKnown = await Location.getLastKnownPositionAsync({});
                if (lastKnown?.coords && isMountedRef.current) {
                    const coords: UserCoordinates = {
                        latitude: lastKnown.coords.latitude,
                        longitude: lastKnown.coords.longitude,
                    };
                    setCachedUserLocation(coords);
                    setUserCoords(coords);
                    setNearbyMechanics(
                        getNearbyMechanics(coords.latitude, coords.longitude, MOCK_MECHANICS, mechanicsLimit)
                    );
                    setIsLoading(false);
                }
            } catch {
                // Ignore and proceed to current position
            }

            // Fresh accurate position
            const position = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            if (position?.coords && isMountedRef.current) {
                const coords: UserCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                setCachedUserLocation(coords);
                setUserCoords(coords);
                setNearbyMechanics(
                    getNearbyMechanics(coords.latitude, coords.longitude, MOCK_MECHANICS, mechanicsLimit)
                );
            }
        } catch (error) {
            console.warn("Could not retrieve user location:", error);
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [mechanicsLimit]);

    useEffect(() => {
        isMountedRef.current = true;
        refreshLocation();

        // Subscribe to real-time location updates
        let subscription: Location.LocationSubscription | null = null;
        Location.getForegroundPermissionsAsync().then(({ status }) => {
            if (status === "granted" && isMountedRef.current) {
                Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        distanceInterval: 10,
                        timeInterval: 5000,
                    },
                    (newLocation) => {
                        if (!isMountedRef.current || !newLocation?.coords) return;
                        const coords: UserCoordinates = {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                        };
                        setCachedUserLocation(coords);
                        setUserCoords(coords);
                        setNearbyMechanics(
                            getNearbyMechanics(coords.latitude, coords.longitude, MOCK_MECHANICS, mechanicsLimit)
                        );
                    }
                ).then((sub) => {
                    subscription = sub;
                }).catch((err) => {
                    console.warn("Location watch error:", err);
                });
            }
        });

        return () => {
            isMountedRef.current = false;
            subscription?.remove();
        };
    }, [refreshLocation, mechanicsLimit]);

    return {
        userCoords,
        hasPermission,
        isLoading,
        nearbyMechanics,
        refreshLocation,
    };
}

export default useUserLocation;
