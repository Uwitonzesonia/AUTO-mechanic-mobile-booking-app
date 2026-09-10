import { useState, useCallback } from "react";
import { getMapboxRoute, LatLng, MapboxRoute, MapboxDirectionsOptions } from "@/services/mapbox";

export function useMapboxRoute() {
    const [route, setRoute] = useState<MapboxRoute | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoute = useCallback(
        async (
            origin: LatLng,
            destination: LatLng,
            options?: MapboxDirectionsOptions
        ): Promise<MapboxRoute | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await getMapboxRoute(origin, destination, options);
                if (result) {
                    setRoute(result);
                    return result;
                } else {
                    setError("Unable to find route between locations.");
                    setRoute(null);
                    return null;
                }
            } catch (err: any) {
                const message = err?.message || "Failed to calculate route.";
                setError(message);
                setRoute(null);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const clearRoute = useCallback(() => {
        setRoute(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        route,
        isLoading,
        error,
        fetchRoute,
        clearRoute,
    };
}

export default useMapboxRoute;
