import React, {forwardRef, useEffect, useState} from "react";
import {Platform, StyleSheet} from "react-native";
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from "react-native-maps";
import {DARK_MAP_STYLE} from "@/constants/mapStyle";
import {UserLocationRadarMarker} from "./UserLocationRadarMarker";
import {MechanicMarker} from "./MechanicMarker";
import type {Mechanic} from "@/types/mechanic";

interface MaintenanceMapViewProps {
    userCoords: { latitude: number; longitude: number };
    mechanics: Mechanic[];
    selectedMechanic: Mechanic | null;
    isSearching: boolean;
    showDetailModal: boolean;
    isBooked: boolean;
    routeCoordinates?: { latitude: number; longitude: number }[];
    onSelectMechanic: (mechanic: Mechanic) => void;
    hideMarkers?: boolean;
}

export const MaintenanceMapView = forwardRef<MapView, MaintenanceMapViewProps>(
    (
        {
            userCoords,
            mechanics,
            selectedMechanic,
            isSearching,
            showDetailModal,
            isBooked,
            routeCoordinates,
            onSelectMechanic,
            hideMarkers = false,
        },
        ref
    ) => {
        const [userTracksViewChanges, setUserTracksViewChanges] = useState(true);

        // Keep marker tracking active while searching, and briefly after search completes
        // so the native map captures the snapshot without the radar circle
        useEffect(() => {
            if (isSearching) {
                setUserTracksViewChanges(true);
            } else {
                setUserTracksViewChanges(true);
                const timer = setTimeout(() => {
                    setUserTracksViewChanges(false);
                }, 600);
                return () => clearTimeout(timer);
            }
        }, [isSearching]);

        return (
            <MapView
                ref={ref}
                provider={Platform.OS === "android" || Platform.OS === "ios" ? PROVIDER_GOOGLE : undefined}
                style={StyleSheet.absoluteFill}
                customMapStyle={DARK_MAP_STYLE}
                showsUserLocation={false}
                showsMyLocationButton={false}
                initialRegion={{
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {!hideMarkers && isBooked && routeCoordinates && routeCoordinates.length > 0 && (
                    <>
                        {/* Outer polyline shadow / glow */}
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeColor="#0284c7"
                            strokeWidth={6}
                            lineCap="round"
                            lineJoin="round"
                        />
                        {/* Primary route polyline */}
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeColor="#38bdf8"
                            strokeWidth={3.5}
                            lineCap="round"
                            lineJoin="round"
                        />
                    </>
                )}

                {!hideMarkers && (
                    <Marker
                        key="user-location-marker"
                        identifier="user-location-marker"
                        coordinate={userCoords}
                        anchor={{x: 0.5, y: 0.5}}
                        title="My Location"
                        tracksViewChanges={userTracksViewChanges}
                    >
                        <UserLocationRadarMarker isSearching={isSearching}/>
                    </Marker>
                )}

                {!hideMarkers && mechanics.map((mechanic) => {
                    const isVisible =
                        !isSearching &&
                        (!showDetailModal || selectedMechanic?.id === mechanic.id);

                    return (
                        <MechanicMarker
                            key={`mechanic-marker-${mechanic.id}`}
                            mechanic={mechanic}
                            isSelected={selectedMechanic?.id === mechanic.id}
                            onPress={() => onSelectMechanic(mechanic)}
                            opacity={isVisible ? 1 : 0}
                        />
                    );
                })}
            </MapView>
        );
    }
);

MaintenanceMapView.displayName = "MaintenanceMapView";
