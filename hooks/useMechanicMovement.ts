import { useState, useEffect, useRef, useCallback } from "react";
import { LatLng, MapboxRoute, getDistanceBetween } from "@/services/mapbox";

export interface UseMechanicMovementProps {
    isBooked: boolean;
    route: MapboxRoute | null;
    originCoords?: LatLng | null;
    userCoords?: LatLng | null;
    durationMs?: number; // total trip time in ms (default: 15000 = 15s)
    stopDistanceMeters?: number; // default: 5 (5 meters)
}

export function useMechanicMovement({
    isBooked,
    route,
    originCoords,
    userCoords,
    durationMs = 15000,
    stopDistanceMeters = 5,
}: UseMechanicMovementProps) {
    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
    const [remainingRoute, setRemainingRoute] = useState<LatLng[]>([]);
    const [remainingDistanceMeters, setRemainingDistanceMeters] = useState<number | null>(null);
    const [remainingDistanceKm, setRemainingDistanceKm] = useState<number | null>(null);
    const [remainingDurationText, setRemainingDurationText] = useState<string | null>(null);
    const [isArrived, setIsArrived] = useState<boolean>(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetMovement = useCallback(() => {
        if (delayTimerRef.current) {
            clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setCurrentLocation(null);
        setRemainingRoute([]);
        setRemainingDistanceMeters(null);
        setRemainingDistanceKm(null);
        setRemainingDurationText(null);
        setIsArrived(false);
    }, []);

    useEffect(() => {
        if (!isBooked) {
            resetMovement();
            return;
        }

        const path: LatLng[] =
            route?.coordinates && route.coordinates.length >= 2
                ? route.coordinates
                : originCoords && userCoords
                ? [originCoords, userCoords]
                : [];

        if (path.length < 2) {
            return;
        }

        // Calculate segment lengths and cumulative total distance
        const segments: number[] = [];
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const segDist = getDistanceBetween(path[i], path[i + 1]);
            segments.push(segDist);
            totalDistance += segDist;
        }

        // Handle case where start distance is already <= stopDistanceMeters
        if (totalDistance <= stopDistanceMeters) {
            setCurrentLocation(path[path.length - 1]);
            setRemainingRoute([]);
            setRemainingDistanceMeters(stopDistanceMeters);
            setRemainingDistanceKm(0);
            setRemainingDurationText("Arrived");
            setIsArrived(true);
            return;
        }

        const travelDistance = totalDistance - stopDistanceMeters;

        // Set initial state at route start
        setCurrentLocation(path[0]);
        setRemainingRoute(path);
        setRemainingDistanceMeters(Math.round(totalDistance));
        setRemainingDistanceKm(Number((totalDistance / 1000).toFixed(1)));
        setRemainingDurationText(
            route?.formattedDuration || `${Math.max(1, Math.round(totalDistance / 250))} min`
        );
        setIsArrived(false);

        // Allow 700ms grace period for camera to frame before mechanic starts rolling
        delayTimerRef.current = setTimeout(() => {
            const startTime = Date.now();

            timerRef.current = setInterval(() => {
                const now = Date.now();
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                const currentTraveled = progress * travelDistance;
                const currentRemaining = Math.max(
                    stopDistanceMeters,
                    Math.round(totalDistance - currentTraveled)
                );

                // Locate position along segments
                let accumulated = 0;
                let currentPoint = path[0];
                let currentSegIndex = 0;

                for (let i = 0; i < segments.length; i++) {
                    const segLen = segments[i];
                    if (accumulated + segLen >= currentTraveled || i === segments.length - 1) {
                        currentSegIndex = i;
                        const segProgress =
                            segLen > 0 ? (currentTraveled - accumulated) / segLen : 0;
                        const clamped = Math.max(0, Math.min(1, segProgress));
                        currentPoint = {
                            latitude:
                                path[i].latitude +
                                clamped * (path[i + 1].latitude - path[i].latitude),
                            longitude:
                                path[i].longitude +
                                clamped * (path[i + 1].longitude - path[i].longitude),
                        };
                        break;
                    }
                    accumulated += segLen;
                }

                // Sliced remaining route from current point to end
                const remainingCoords: LatLng[] = [
                    currentPoint,
                    ...path.slice(currentSegIndex + 1),
                ];

                const remainingMinutes = Math.max(1, Math.round(currentRemaining / 250));
                const durationText =
                    currentRemaining <= stopDistanceMeters
                        ? "Arrived"
                        : `${remainingMinutes} min`;

                setCurrentLocation(currentPoint);
                setRemainingRoute(remainingCoords);
                setRemainingDistanceMeters(currentRemaining);
                setRemainingDistanceKm(Number((currentRemaining / 1000).toFixed(1)));
                setRemainingDurationText(durationText);

                if (progress >= 1 || currentRemaining <= stopDistanceMeters) {
                    setIsArrived(true);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }
            }, 100);
        }, 700);

        return () => {
            if (delayTimerRef.current) {
                clearTimeout(delayTimerRef.current);
                delayTimerRef.current = null;
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [
        isBooked,
        route,
        originCoords?.latitude,
        originCoords?.longitude,
        userCoords?.latitude,
        userCoords?.longitude,
        durationMs,
        stopDistanceMeters,
        resetMovement,
    ]);

    return {
        currentLocation,
        remainingRoute,
        remainingDistanceMeters,
        remainingDistanceKm,
        remainingDurationText,
        isArrived,
        resetMovement,
    };
}

export default useMechanicMovement;
