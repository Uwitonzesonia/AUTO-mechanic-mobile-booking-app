import React, {useCallback, useEffect, useRef, useState} from "react";
import {Marker} from "react-native-maps";
import MechanicMapMarker from "@/components/maintenance/map/MechanicMapMarker";
import type {Mechanic} from "@/types/mechanic";

interface MechanicMarkerProps {
    mechanic: Mechanic;
    isSelected: boolean;
    onPress: () => void;
    opacity?: number;
}

/**
 * Map marker for an individual mechanic.
 * Manages `tracksViewChanges` to ensure fluid 60fps panning while correctly rasterizing avatar images.
 */
export const MechanicMarker = React.memo(
    ({mechanic, isSelected, onPress, opacity = 1}: MechanicMarkerProps) => {
        const [tracksViewChanges, setTracksViewChanges] = useState(true);
        const trackingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
        const isFirstRender = useRef(true);

        const lat = mechanic.current_location?.lat ?? mechanic.location?.lat;
        const lon = mechanic.current_location?.lon ?? mechanic.location?.lon;

        const pulseTracking = useCallback((durationMs = 500) => {
            setTracksViewChanges(true);
            if (trackingTimer.current) clearTimeout(trackingTimer.current);
            trackingTimer.current = setTimeout(() => {
                setTracksViewChanges(false);
            }, durationMs);
        }, []);

        // Initial rasterization grace period
        useEffect(() => {
            const timer = setTimeout(() => setTracksViewChanges(false), 2500);
            return () => {
                clearTimeout(timer);
                if (trackingTimer.current) clearTimeout(trackingTimer.current);
            };
        }, []);

        // Re-render snapshot when visibility or selection state transitions
        useEffect(() => {
            if (opacity === 1) pulseTracking(600);
        }, [opacity, pulseTracking]);

        useEffect(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            pulseTracking(400);
        }, [isSelected, pulseTracking]);

        if (lat === undefined || lon === undefined) {
            return null;
        }

        return (
            <Marker
                identifier={`mechanic-marker-${mechanic.id}`}
                coordinate={{latitude: lat, longitude: lon}}
                anchor={{x: 0.5, y: 1}}
                title={mechanic.names}
                description={`⭐ ${mechanic.rating} • Flat: $${mechanic.flat_fee}`}
                onPress={opacity > 0 ? onPress : undefined}
                tracksViewChanges={tracksViewChanges}
                opacity={opacity}
            >
                <MechanicMapMarker
                    mechanic={mechanic}
                    isSelected={isSelected}
                    onImageLoad={() => pulseTracking(500)}
                />
            </Marker>
        );
    }
);

MechanicMarker.displayName = "MechanicMarker";
