import React, { useEffect } from "react";
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import Svg, { Image as SvgImage, Defs, ClipPath, Circle } from "react-native-svg";
import type { Mechanic } from "@/types/mechanic";

interface MechanicMapMarkerProps {
    mechanic: Mechanic;
    isSelected?: boolean;
    style?: StyleProp<ViewStyle>;
    onImageLoad?: () => void;
}

export const MechanicMapMarker: React.FC<MechanicMapMarkerProps> = ({
    mechanic,
    isSelected = false,
    style,
    onImageLoad,
}) => {
    const profileImg =
        mechanic.profileImage ||
        (mechanic as any).profile_image ||
        (mechanic as any).avatar_url ||
        (mechanic as any).photoURL;

    const initial = (mechanic.names?.[0] || "M").toUpperCase();
    const distance = mechanic.current_location?.distanceKm;
    const totalServices = mechanic.total_services ?? 0;

    useEffect(() => {
        if (profileImg) {
            Image.prefetch(profileImg).catch(() => {});
        }
    }, [profileImg]);

    return (
        <View collapsable={false} style={[styles.container, isSelected && styles.selectedContainer, style]}>
            {/* Top Distance Pill */}
            {distance !== undefined && (
                <View style={[styles.distBadge, isSelected && styles.selectedDistBadge]}>
                    <Text style={styles.distText}>{distance} km</Text>
                </View>
            )}

            {/* Pin Body with location-sharp in #ff5050 */}
            <View style={styles.pinWrapper}>
                {/* 1. Base Pin Icon */}
                <Ionicons
                    name="location-sharp"
                    size={52}
                    color="#ff5050"
                    style={styles.pinIcon}
                />

                {/* 2. Direct Profile Image in Center of Pin Head */}
                <View style={styles.avatarWrapper}>
                    {profileImg ? (
                        <>
                            {/* SVG-based image renderer for Fabric / Android Canvas compatibility */}
                            <Svg width={25} height={25} viewBox="0 0 25 25" style={StyleSheet.absoluteFill}>
                                <Defs>
                                    <ClipPath id={`clip-${mechanic.id}`}>
                                        <Circle cx="12.5" cy="12.5" r="12.5" />
                                    </ClipPath>
                                </Defs>
                                <SvgImage
                                    href={{ uri: profileImg }}
                                    width="25"
                                    height="25"
                                    preserveAspectRatio="xMidYMid slice"
                                    clipPath={`url(#clip-${mechanic.id})`}
                                    onLoad={() => onImageLoad?.()}
                                />
                            </Svg>

                            {/* Standard Native Image */}
                            <Image
                                source={{ uri: profileImg }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                                fadeDuration={0}
                                onLoad={() => onImageLoad?.()}
                                onError={() => onImageLoad?.()}
                            />
                        </>
                    ) : (
                        <Text style={styles.fallbackInitial}>{initial}</Text>
                    )}
                </View>

                {/* 3. Side Badge: Number of Services */}
                {totalServices > 0 && (
                    <View style={styles.servicesBadge}>
                        <Text style={styles.servicesBadgeText}>{totalServices}</Text>
                    </View>
                )}

                {/* 4. Red Dot with White Border on Bottom Edge */}
                <View style={styles.redDot} />
            </View>
        </View>
    );
};

export default MechanicMapMarker;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 4,
        minWidth: 84,
    },
    selectedContainer: {
        transform: [{ scale: 1.12 }],
    },
    distBadge: {
        backgroundColor: "#141A22",
        paddingHorizontal: 8,
        paddingVertical: 2.5,
        borderRadius: 7,
        marginBottom: 2,
        zIndex: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 3,
        elevation: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedDistBadge: {
        backgroundColor: "#0094FF",
        borderColor: "#ffffff",
    },
    distText: {
        color: "#ffffff",
        fontSize: 10.5,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false,
    },
    pinWrapper: {
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        width: 54,
        height: 58,
    },
    pinIcon: {
        position: "absolute",
        top: 0,
        alignSelf: "center",
    },
    avatarWrapper: {
        position: "absolute",
        top: 5,
        alignSelf: "center",
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#1C293A",
        borderWidth: 1.5,
        borderColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
    },
    avatarImage: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
    },
    fallbackInitial: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "800",
        textAlign: "center",
    },
    servicesBadge: {
        position: "absolute",
        top: 2,
        right: -10,
        minWidth: 22,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#0094FF",
        paddingHorizontal: 5,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.2,
        borderColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 25,
        zIndex: 60,
    },
    servicesBadgeText: {
        color: "#ffffff",
        fontSize: 9.5,
        fontWeight: "800",
        textAlign: "center",
        includeFontPadding: false,
    },
    redDot: {
        position: "absolute",
        bottom: 1,
        alignSelf: "center",
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#E40019",
        borderWidth: 1.5,
        borderColor: "#ffffff",
        elevation: 25,
        zIndex: 60,
    },
});
