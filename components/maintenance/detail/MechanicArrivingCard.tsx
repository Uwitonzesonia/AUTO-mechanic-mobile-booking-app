import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {Avatar} from "@/components/ui/Avatar";
import {Button} from "@/components/ui/Button";
import {callPhoneNumber} from "@/utils/phone";
import type {Mechanic} from "@/types/mechanic";
import {
    formatDistance,
    getMechanicAvatarUrl,
    getMechanicInitial,
    getMechanicName,
} from "./types";

interface MechanicArrivingCardProps {
    mechanic: Mechanic;
    distance?: number;
    durationText?: string;
    onClose?: () => void;
    onChat?: (mechanic: Mechanic) => void;
    onCall?: (mechanic: Mechanic) => void;
}

export function MechanicArrivingCard({
                                         mechanic,
                                         distance,
                                         durationText,
                                         onClose,
                                         onChat,
                                         onCall,
                                     }: MechanicArrivingCardProps) {
    const router = useRouter();
    const name = getMechanicName(mechanic);
    const initial = getMechanicInitial(name);
    const avatarUrl = getMechanicAvatarUrl(mechanic);

    const rating = mechanic.rating != null ? Number(mechanic.rating).toFixed(1) : "0.0";
    const experience = mechanic.years_experience ?? 0;
    const etaText = durationText ? durationText.replace(/\s*mins?/i, "min") : "5min";

    const resolvedDistance =
        distance ??
        mechanic.current_location?.distanceKm ??
        mechanic.location?.distanceKm;
    const distanceText = formatDistance(resolvedDistance);

    const expertise =
        mechanic.expertise && mechanic.expertise.length > 0
            ? mechanic.expertise.join(", ")
            : "General Maintenance";

    const handleChatPress = () => {
        if (onChat) {
            onChat(mechanic);
        } else {
            router.push("/(drawer)/messages");
        }
    };

    const handleCallPress = () => {
        if (onCall) {
            onCall(mechanic);
        } else {
            callPhoneNumber(mechanic.telephone, name);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.handlePill}/>

            <View style={styles.arrivalRow}>
                <Text style={styles.arrivalTitle}>Arriving {etaText}</Text>
                <Text style={styles.distanceSubtitle}>{distanceText} away</Text>
            </View>

            <View style={styles.profileRow}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarWrapper}>
                        <Avatar
                            imageUrl={avatarUrl}
                            avatarSize={46}
                            avatarBorderRadius={23}
                            avatarBorderWidth={2}
                            avatarBorderColor="#ffffff"
                            avatarBackgroundColor="rgba(255, 255, 255, 0.12)"
                        >
                            <Text style={styles.avatarFallback}>{initial}</Text>
                        </Avatar>
                        {mechanic.is_online !== false && <View style={styles.onlineBadge}/>}
                    </View>

                    <Text style={styles.nameText} numberOfLines={1}>
                        {name}
                    </Text>
                </View>

                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={13} color="#FFB800"/>
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expertise</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                    {expertise}
                </Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Years of experience</Text>
                <Text style={styles.detailValue}>{experience}yrs</Text>
            </View>

            <View style={styles.actionsRow}>
                <Button
                    variant="custom"
                    size="icon"
                    icon={<Ionicons name="close-outline" size={22} color="#ffffff"/>}
                    style={styles.cancelButton}
                    onPress={onClose}
                    accessibilityLabel="Cancel mechanic"
                />

                <Button
                    variant="custom"
                    size="icon"
                    icon={<Ionicons name="chatbubble-outline" size={22} color="#64748B"/>}
                    style={[styles.actionWhiteButton, {transform: "scaleX(-1)"}]}
                    onPress={handleChatPress}
                    accessibilityLabel="Chat with mechanic"
                />

                <Button
                    variant="custom"
                    size="icon"
                    icon={<Ionicons name="call-outline" size={22} color="#64748B"/>}
                    style={styles.actionWhiteButton}
                    onPress={handleCallPress}
                    accessibilityLabel="Call mechanic"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 18,
        backgroundColor: "#141A22",
    },
    handlePill: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#475569",
        alignSelf: "center",
        marginBottom: 14,
        marginTop: -2,
    },
    arrivalRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    arrivalTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    distanceSubtitle: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
    },
    avatarWrapper: {
        position: "relative",
        marginRight: 12,
    },
    avatarFallback: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
    },
    onlineBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#10B981",
        borderWidth: 2,
        borderColor: "#141A22",
        zIndex: 10,
    },
    nameText: {
        fontSize: 16.5,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    ratingBadge: {
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 8,
        paddingVertical: 2,
        gap: 4,
        borderRadius: 12,
        backgroundColor: "#ffffff",
    },
    ratingText: {
        fontSize: 12.5,
        fontWeight: "700",
        color: "#000000",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 13.5,
        fontWeight: "500",
        color: "#94A3B8",
    },
    detailValue: {
        fontSize: 13.5,
        fontWeight: "600",
        color: "#FFFFFF",
        textAlign: "right",
        flexShrink: 1,
        marginLeft: 16,
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 28,
        marginTop: 14,
        paddingVertical: 4,
    },
    cancelButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#fd0d0d",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#fd0d0d",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    actionWhiteButton: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000000",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 0,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
});
