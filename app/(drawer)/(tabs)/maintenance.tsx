import React, { useLayoutEffect, useState, useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import BottomCard from "@/components/maintenance/BottomCard";
import { UserLocationRadarMarker } from "@/components/maintenance/UserLocationRadarMarker";
import { MechanicMapMarker } from "@/components/maintenance/MechanicMapMarker";
import { TransparentHeaderCard } from "@/components/maintenance/TransparentHeaderCard";
import { DARK_MAP_STYLE } from "@/constants/mapStyle";
import { useUserLocation } from "@/hooks/useUserLocation";
import { LinearBgView } from "@/components/LinearBg";
import type { Mechanic } from "@/types/mechanic";

interface MechanicMarkerProps {
    mechanic: Mechanic;
    isSelected: boolean;
    onPress: () => void;
    opacity?: number;
}

const MechanicMarker = React.memo(({ mechanic, isSelected, onPress, opacity = 1 }: MechanicMarkerProps) => {
    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    const stopTrackingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    const lat = mechanic.current_location?.lat ?? mechanic.location?.lat;
    const lon = mechanic.current_location?.lon ?? mechanic.location?.lon;
    if (lat === undefined || lon === undefined) return null;

    const handleImageLoad = useCallback(() => {
        if (stopTrackingTimer.current) clearTimeout(stopTrackingTimer.current);
        // Keep tracking active for 500ms so react-native-maps captures the rendered image bitmap
        stopTrackingTimer.current = setTimeout(() => {
            setTracksViewChanges(false);
        }, 500);
    }, []);

    // Initial mount: keep tracking active for 3 seconds so pre-fetched images render into the snapshot
    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 3000);
        return () => {
            clearTimeout(timer);
            if (stopTrackingTimer.current) clearTimeout(stopTrackingTimer.current);
        };
    }, []);

    // Re-enable tracking temporarily when opacity transitions to 1 (visible) so snapshot captures cleanly
    useEffect(() => {
        if (opacity === 1) {
            setTracksViewChanges(true);
            const timer = setTimeout(() => {
                setTracksViewChanges(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [opacity]);

    // Re-enable tracking temporarily when selection changes so scale and styles update
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setTracksViewChanges(true);
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [isSelected]);

    return (
        <Marker
            identifier={`mechanic-marker-${mechanic.id}`}
            coordinate={{ latitude: lat, longitude: lon }}
            anchor={{ x: 0.5, y: 1 }}
            title={mechanic.names}
            description={`⭐ ${mechanic.rating} • Flat: $${mechanic.flat_fee}`}
            onPress={opacity > 0 ? onPress : undefined}
            tracksViewChanges={tracksViewChanges}
            opacity={opacity}
        >
            <MechanicMapMarker
                mechanic={mechanic}
                isSelected={isSelected}
                onImageLoad={handleImageLoad}
            />
        </Marker>
    );
});

export default function MaintenanceScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams<{
        searchTrigger?: string;
        car?: string;
        location?: string;
        category?: string;
    }>();
    const mapRef = useRef<MapView | null>(null);

    // Search state
    const [isSearching, setIsSearching] = useState(true);
    const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

    // Fetch user location and get 5 closest mechanics relative to user
    const { userCoords, nearbyMechanics, hasPermission, refreshLocation } = useUserLocation(5);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => null,
        });
    }, [navigation]);

    // Handle search trigger from RepairLocationModal
    const prevSearchTriggerRef = useRef<string | undefined>(params.searchTrigger);
    useEffect(() => {
        if (params.searchTrigger && params.searchTrigger !== prevSearchTriggerRef.current) {
            prevSearchTriggerRef.current = params.searchTrigger;
            setIsSearching(true);
            setSelectedMechanic(null);
            refreshLocation();

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
        }
    }, [params.searchTrigger, refreshLocation, userCoords]);

    // When searching completes, auto-select the closest mechanic
    const handleSearchComplete = useCallback(() => {
        setIsSearching(false);
        if (nearbyMechanics.length > 0) {
            setSelectedMechanic(nearbyMechanics[0]);
        }
    }, [nearbyMechanics]);

    // When nearby mechanics are ready and not currently searching, select the closest one by default
    useEffect(() => {
        if (!isSearching && nearbyMechanics.length > 0 && !selectedMechanic) {
            setSelectedMechanic(nearbyMechanics[0]);
        }
    }, [isSearching, nearbyMechanics, selectedMechanic]);

    // Pre-fetch mechanic avatar images as soon as nearby mechanics are loaded
    useEffect(() => {
        if (nearbyMechanics && nearbyMechanics.length > 0) {
            nearbyMechanics.forEach((m) => {
                const img = m.profileImage || (m as any).profile_image;
                if (img) {
                    Image.prefetch(img).catch(() => {});
                }
            });
        }
    }, [nearbyMechanics]);

    // Animate map camera when user location is detected or updated
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
    }, [userCoords?.latitude, userCoords?.longitude]);

    return (
        <LinearBgView style={styles.container}>
            {/* Transparent Floating Header (Back, [x >> Slide to cancel], Profile Avatar) */}
            <TransparentHeaderCard
                onCancelPress={() => {
                    navigation.goBack();
                }}
            />

            {userCoords ? (
                <>
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
                        {/* User Location with White Border Circle (scaling up and down while searching, non-scaling after search) */}
                        <Marker
                            key="user-location-marker"
                            identifier="user-location-marker"
                            coordinate={userCoords}
                            anchor={{ x: 0.5, y: 0.5 }}
                            title="My Location"
                            tracksViewChanges={isSearching}
                        >
                            <UserLocationRadarMarker isSearching={isSearching} />
                        </Marker>

                        {/* 5 Closest Mechanics: keep mounted with opacity to avoid native marker duplicates */}
                        {nearbyMechanics.map((mechanic) => (
                            <MechanicMarker
                                key={`mechanic-marker-${mechanic.id}`}
                                mechanic={mechanic}
                                isSelected={selectedMechanic?.id === mechanic.id}
                                onPress={() => setSelectedMechanic(mechanic)}
                                opacity={isSearching ? 0 : 1}
                            />
                        ))}
                    </MapView>

                    {/* Bottom Card Overlay */}
                    <View style={styles.bottomContainer} pointerEvents="box-none">
                        <BottomCard
                            key={params.searchTrigger || "initial-search"}
                            isSearching={isSearching}
                            onSearchComplete={handleSearchComplete}
                        />
                    </View>
                </>
            ) : hasPermission === false ? (
                <View style={styles.centerFeedbackContainer}>
                    <Ionicons name="location-outline" size={56} color="#ef4444" />
                    <Text style={styles.feedbackTitle}>Location Permission Needed</Text>
                    <Text style={styles.feedbackSubtitle}>
                        AUTO Mechanic requires your location to find mechanics near you.
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        activeOpacity={0.8}
                        onPress={refreshLocation}
                    >
                        <Text style={styles.retryButtonText}>Enable Location</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.centerFeedbackContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.loadingText}>Acquiring your location...</Text>
                </View>
            )}
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
        bottom: 4,
        left: 16,
        right: 16,
    },
    centerFeedbackContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    feedbackTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    feedbackSubtitle: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    retryButton: {
        backgroundColor: "#2563eb",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    retryButtonText: {
        color: "#ffffff",
        fontWeight: "600",
        fontSize: 15,
    },
    loadingText: {
        fontSize: 15,
        color: "#9ca3af",
        marginTop: 16,
    },
});
