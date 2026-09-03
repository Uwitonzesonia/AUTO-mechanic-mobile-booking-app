import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { BlurView } from "expo-blur";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Mechanic } from "@/types/mechanic";

export interface MechanicDetailCardProps {
    mechanic: Mechanic;
    distance?: number;
    onResearch?: () => void;
    onConfirm?: (mechanic: Mechanic) => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
}

export const MechanicDetailCard: React.FC<MechanicDetailCardProps> = ({
    mechanic,
    distance,
    onResearch,
    onConfirm,
    onClose,
    style,
}) => {
    const slideAnim = useRef(new Animated.Value(18)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        slideAnim.setValue(18);
        opacityAnim.setValue(0);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();
    }, [mechanic.id, slideAnim, opacityAnim]);

    const profileImg =
        mechanic.profileImage ||
        (mechanic as any).profile_image ||
        (mechanic as any).avatar_url ||
        (mechanic as any).photoURL;

    const mechanicName = mechanic.names || mechanic.fullName || "";
    const initial = (mechanicName[0] || "M").toUpperCase();
    const rating = mechanic.rating != null ? Number(mechanic.rating).toFixed(1) : "0.0";
    const fixes = mechanic.total_services != null ? `${mechanic.total_services}` : "0";
    const experience = mechanic.years_experience != null ? `${mechanic.years_experience}` : "0";

    const rawDistance =
        distance !== undefined
            ? distance
            : mechanic.current_location?.distanceKm !== undefined
                ? mechanic.current_location.distanceKm
                : mechanic.location?.distanceKm;
    const displayDistance =
        rawDistance != null
            ? `${Number(rawDistance).toFixed(1)} km`
            : "0.0 km";

    return (
        <Animated.View
            style={[
                styles.cardWrapper,
                {
                    opacity: opacityAnim,
                    transform: [{ translateY: slideAnim }],
                },
                style,
            ]}
        >
            <BlurView
                intensity={90}
                tint={"prominent"}
                style={styles.cardContainer}
            >
                {/* Top Row: Avatar + Name & Rating + Close Button */}
                <View style={styles.topRow}>
                    {/* 1. Shared UI Avatar Component with Online Indicator */}
                    <View style={styles.avatarContainer}>
                        <Avatar
                            imageUrl={profileImg}
                            avatarSize={50}
                            avatarBorderRadius={25}
                            avatarBorderWidth={2}
                            avatarBorderColor="#ffffff"
                            avatarBackgroundColor="rgba(255, 255, 255, 0.12)"
                        >
                            <Text style={styles.avatarFallbackText}>{initial}</Text>
                        </Avatar>
                        {mechanic.is_online !== false && <View style={styles.onlineBadge} />}
                    </View>

                    {/* 2. Name & Rating */}
                    <View style={styles.infoCol}>
                        <Text style={styles.nameText} numberOfLines={1}>
                            {mechanicName}
                        </Text>

                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={13} color="#FFB800" />
                            <Text style={styles.ratingText}>{rating}</Text>
                        </View>
                    </View>

                    {/* 3. Close Button using shared UI Button */}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="icon"
                            icon={<Ionicons name="close" size={16} color="#94A3B8" />}
                            style={styles.closeBtn}
                            onPress={onClose}
                            accessibilityLabel="Close mechanic details"
                        />
                    )}
                </View>

                {/* Middle Row: 3 Highlight Metrics (Fixes, Years of Experience, Distance from Location) */}
                <View style={styles.metricsRow}>
                    {/* Fixes */}
                    <View style={styles.metricPill}>
                        <Text style={styles.metricText}>{fixes}</Text>
                        <Text style={styles.text}>Fixes</Text>
                    </View>

                    {/* Years of Experience */}
                    <View style={styles.metricPill}>
                        <Text style={styles.metricText}>{experience}+</Text>
                        <Text style={styles.text}>Years of experience</Text>
                    </View>

                    {/* Distance from my location */}
                    <View style={styles.metricPill}>
                        <Text style={styles.metricText}>{displayDistance}</Text>
                        <Text style={styles.text}>Away from you</Text>
                    </View>
                </View>

                {/* Bottom Row: Circular Icon Buttons using shared UI Button */}
                <View style={styles.actionsRow}>
                    {/* Re-Search Circular Icon Button */}
                    <Button
                        variant="custom"
                        size="icon"
                        icon={<FontAwesome name="refresh" size={20} color="#ffffff" />}
                        style={styles.circleIconButton}
                        onPress={onResearch}
                        accessibilityLabel="Re-Search mechanics"
                    />

                    {/* Confirm Circular Icon Button */}
                    <Button
                        variant="custom"
                        size="icon"
                        icon={<FontAwesome name="check" size={22} color="#ffffff" />}
                        style={styles.circleIconButton}
                        onPress={() => onConfirm?.(mechanic)}
                        accessibilityLabel={`Confirm ${mechanicName}`}
                    />
                </View>
            </BlurView>
        </Animated.View>
    );
};

export default MechanicDetailCard;

const styles = StyleSheet.create({
    cardWrapper: {
        borderRadius: 22,
        overflow: "hidden",
               width: "75%",
        alignSelf: "center",
        borderWidth: 1.2,
        borderColor: "rgba(255, 255, 255, 0.22)",
    },
    cardContainer: {
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 14,
        backgroundColor: "rgba(10, 10, 10, 2.85)",
        overflow: "hidden",
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    avatarContainer: {
        position: "relative",
        marginRight: 12,
    },
    avatarFallbackText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
    },
    onlineBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 13,
        height: 13,
        borderRadius: 6.5,
        backgroundColor: "#10B981",
        borderWidth: 2,
        borderColor: "#141A22",
        zIndex: 10,
    },
    infoCol: {
        flex: 1,
        justifyContent: "flex-start",
    },
    nameText: {
        fontSize: 16.5,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    ratingRow: {
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginTop: 4,
        gap: 4,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    ratingText: {
        fontSize: 12.5,
        fontWeight: "700",
        color: "#000",
    },
    closeBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        marginLeft: 8,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    /* Metrics Row */
    metricsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        marginBottom: 12,
    },
    metricPill: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    metricText: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "900",
        color: "#fff",
        includeFontPadding: false,
    },
    text: {
        textAlign: "center",
        fontSize: 11,
        color: "#CBD5E1",
        includeFontPadding: false,
    },
    /* Actions Row */
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        marginTop: 4,
        paddingVertical: 4,
    },
    circleIconButton: {
        width: 44,
        height: 44,
        borderRadius: 24,
        backgroundColor: "#fd0d0d",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#fd0d0d",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 6,
        elevation: 6,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
});
