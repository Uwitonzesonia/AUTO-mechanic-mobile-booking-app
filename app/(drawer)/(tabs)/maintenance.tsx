import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomCard from "@/components/maintenance/BottomCard";
import { LocationArrowMarker } from "@/components/maintenance/LocationArrowMarker";
import { MechanicMapMarker } from "@/components/maintenance/MechanicMapMarker";
import { TransparentHeaderCard } from "@/components/maintenance/TransparentHeaderCard";
import { DARK_MAP_STYLE } from "@/constants/mapStyle";
import { useUserLocation } from "@/hooks/useUserLocation";
import { LinearBgView } from "@/components/LinearBg";
import type { Mechanic } from "@/types/mechanic";

export default function MaintenanceScreen() {
    const navigation = useNavigation();
    const mapRef = useRef<MapView | null>(null);

    // Fetch user location and get 5 closest mechanics relative to user
    const { userCoords, nearbyMechanics } = useUserLocation(5);
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null,
        });
    }, [navigation]);

    // When nearby mechanics are ready, select the closest one by default
    useEffect(() => {
        if (nearbyMechanics.length > 0 && !selectedMechanic) {
            setSelectedMechanic(nearbyMechanics[0]);
        }
    }, [nearbyMechanics, selectedMechanic]);

    // Animate map camera when user location is detected
    useEffect(() => {
        if (mapRef.current && userCoords) {
            mapRef.current.animateToRegion(
                {
                    latitude: userCoords.latitude,
                    longitude: userCoords.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                },
                800
            );
        }
    }, [userCoords]);

    return (
        <LinearBgView style={styles.container}>
            {/* Transparent Floating Header (Back, [x >> Slide to cancel], Profile Avatar) */}
            <TransparentHeaderCard
                onCancelPress={() => {
                    navigation.goBack();
                }}
            />

            {/* Dark Theme Map Background */}
            <MapView
                ref={mapRef}
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
                {/* User Location Arrow */}
                <Marker
                    key="user-location-marker"
                    identifier="user-location-marker"
                    coordinate={userCoords}
                    anchor={{ x: 0.5, y: 0.5 }}
                    title="My Location"
                    tracksViewChanges={false}
                >
                    <LocationArrowMarker size={28} />
                </Marker>

                {/* 5 Closest Mechanics with custom location-sharp + avatar + red dot marker */}
                {nearbyMechanics.map((mechanic) => {
                    const lat = mechanic.current_location?.lat ?? mechanic.location?.lat;
                    const lon = mechanic.current_location?.lon ?? mechanic.location?.lon;
                    if (lat === undefined || lon === undefined) return null;

                    const isSelected = selectedMechanic?.id === mechanic.id;

                    return (
                        <Marker
                            key={`mechanic-marker-${mechanic.id}`}
                            identifier={`mechanic-marker-${mechanic.id}`}
                            coordinate={{ latitude: lat, longitude: lon }}
                            anchor={{ x: 0.5, y: 1 }}
                            title={mechanic.names}
                            description={`⭐ ${mechanic.rating} • Flat: $${mechanic.flat_fee}`}
                            onPress={() => setSelectedMechanic(mechanic)}
                            tracksViewChanges={true}
                        >
                            <MechanicMapMarker
                                mechanic={mechanic}
                                isSelected={isSelected}
                            />
                        </Marker>
                    );
                })}
            </MapView>

            {/* Bottom Card Overlay */}
            <SafeAreaView edges={["bottom"]} style={styles.bottomContainer} pointerEvents="box-none">
                <BottomCard />
            </SafeAreaView>
        </LinearBgView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0e1626",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
    },
});
