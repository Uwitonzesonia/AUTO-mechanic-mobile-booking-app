import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {BackHandler, ScrollView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import {AlertDialog, Avatar, Button, Rating} from "@/components/ui";
import {MOCK_MECHANICS} from "@/constants/mechanics";
import {formatRealisticDuration, getMechanicAvatarUrl, getMechanicName} from "@/components/maintenance/detail/types";
import type {Mechanic} from "@/types/mechanic";

export default function JobScreen() {
    const navigation = useNavigation();
    const router = useRouter();

    const params = useLocalSearchParams<{
        vehicle?: string;
        pickupPoint?: string;
        description?: string;
        duration?: string;
        price?: string;
        mechanicId?: string;
        fromTab?: string;
    }>();

    const [jobStatus, setJobStatus] = useState<"pending" | "in_progress" | "declined">("pending");
    const [showDeclineDialog, setShowDeclineDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const mechanic = useMemo<Mechanic | undefined>(() => {
        if (params.mechanicId) {
            const found = MOCK_MECHANICS.find((m) => String(m.id) === String(params.mechanicId));
            if (found) return found;
        }
        return MOCK_MECHANICS[0];
    }, [params.mechanicId]);

    const vehicle = params.vehicle || "Toyota RAV4 (2020)";
    const pickupPoint = params.pickupPoint || "KG 125 St, Kigali, Rwanda";
    const description = params.description || "General Checkup & Engine Diagnostic";
    const duration = useMemo(() => {
        if (
            params.duration &&
            params.duration !== "45 mins" &&
            !params.duration.includes("2021") &&
            !params.duration.includes("2030")
        ) {
            return params.duration;
        }
        return formatRealisticDuration();
    }, [params.duration]);
    const priceFormatted = useMemo(() => {
        if (!params.price) return "€70";
        return params.price.startsWith("€") ? params.price : `€${params.price}`;
    }, [params.price]);

    const getTargetTabPath = useCallback((tab?: string) => {
        if (tab === "garage") return "/(drawer)/(tabs)/garage" as const;
        if (tab === "wallet") return "/(drawer)/(tabs)/wallet" as const;
        if (tab === "profile") return "/(drawer)/(tabs)/profile" as const;
        return "/(drawer)/(tabs)" as const;
    }, []);

    const handleExit = useCallback(() => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
        const target = getTargetTabPath(params.fromTab);
        router.replace(target);
    }, [router, params.fromTab, getTargetTabPath]);

    const handleReturnToSearching = useCallback(() => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
        router.replace({
            pathname: "/(drawer)/(tabs)/maintenance",
            params: {
                searchTrigger: String(Date.now()),
                fromTab: params.fromTab,
                car: params.vehicle,
                location: params.pickupPoint,
                category: params.description,
                duration: params.duration,
                bookedMechanicId: "",
                bookedTimestamp: "",
                price: "",
            },
        });
    }, [router, params.fromTab, params.vehicle, params.pickupPoint, params.description, params.duration]);

    const handleRateClick = useCallback(() => {
        if (router.canDismiss()) {
            router.dismissAll();
        }
        router.replace({
            pathname: "/(drawer)/(tabs)/maintenance",
            params: {
                showRatingModal: "true",
                ratingMechanicId: mechanic?.id ? String(mechanic.id) : params.mechanicId,
                ratingMechanicData: mechanic ? JSON.stringify(mechanic) : undefined,
                fromTab: params.fromTab,
            },
        });
    }, [router, mechanic, params.mechanicId, params.fromTab]);

    const handleConfirm = () => {
        setJobStatus("in_progress");
        setShowConfirmDialog(true);
    };

    const handleDeclinePress = useCallback(() => {
        setShowDeclineDialog(true);
    }, []);

    const handleConfirmDecline = () => {
        setShowDeclineDialog(false);
        setJobStatus("declined");
        handleReturnToSearching();
    };

    // Hardware back handler
    useEffect(() => {
        const onHardwareBack = () => {
            if (jobStatus === "pending") {
                handleDeclinePress();
                return true;
            }
            handleExit();
            return true;
        };

        const sub = BackHandler.addEventListener("hardwareBackPress", onHardwareBack);
        return () => sub.remove();
    }, [handleDeclinePress, handleExit]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <CustomHeader
                    title="Job Information"
                    showBackButton
                    showMenuButton={false}
                    headerInMiddle
                    onBackPress={() => {
                        if (jobStatus === "pending") {
                            handleDeclinePress();
                        } else {
                            handleExit();
                        }
                    }}
                />
            ),
        });
    }, [navigation, handleDeclinePress, handleExit]);

    const mechanicName = mechanic ? getMechanicName(mechanic) : "Assigned Mechanic";
    const mechanicAvatar = mechanic ? getMechanicAvatarUrl(mechanic) : undefined;
    const mechanicRating =
        mechanic?.rating != null ? Number(mechanic.rating) : 4.9;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.mechanicCard}>
                <View style={styles.mechanicRow}>
                    <View style={styles.mechanicLeft}>
                        <Avatar
                            imageUrl={mechanicAvatar}
                            avatarSize={48}
                            avatarBorderRadius={24}
                            avatarBorderWidth={2}
                            avatarBorderColor="red"
                        />
                        <Text style={styles.mechanicName} numberOfLines={1}>
                            {mechanicName}
                        </Text>
                    </View>

                    <Rating
                        mechanic={mechanic}
                        value={mechanicRating}
                        variant="badge"
                        fromTab={params.fromTab}
                        onPress={handleRateClick}
                    />
                </View>

                {/* Job Details Card - centered items, no icons */}
                <View style={styles.cardSection}>

                    {/* Vehicle */}
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Vehicle</Text>
                        <Text style={styles.infoValue}>{vehicle}</Text>
                    </View>

                    {/* Pick up point */}
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Pick up point</Text>
                        <Text style={styles.infoValue}>{pickupPoint}</Text>
                    </View>

                    {/* Car fix description */}
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Car fix description</Text>
                        <Text style={styles.infoValue}>{description}</Text>
                    </View>

                    {/* Duration of fix */}
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Duration of fix</Text>
                        <Text style={styles.infoValue}>{duration}</Text>
                    </View>

                    {/* Price */}
                    <View style={styles.infoItem}>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={[styles.infoValue, styles.priceValue]}>
                            {priceFormatted}
                        </Text>
                    </View>
                </View>

                {/* Actions: Confirm, Decline */}
                {jobStatus === "pending" ? (
                    <View style={styles.actionsContainer}>
                        <Button
                            title="Confirm"
                            variant="primary"
                            onPress={handleConfirm}
                            style={styles.actionBtn}
                        />
                        <Button
                            title="Decline"
                            variant="custom"
                            onPress={handleDeclinePress}
                            textStyle={{color: "#000"}}
                            style={[styles.actionBtn, {backgroundColor: "#ffffff"}]}
                        />
                    </View>
                ) : (
                    <View style={styles.actionsContainer}>
                        <Button
                            title="Return to Home"
                            variant="primary"
                            onPress={handleExit}
                            style={styles.actionBtnFull}
                        />
                    </View>
                )}

                {/* Prebuilt AlertDialog for Decline */}
                <AlertDialog
                    visible={showDeclineDialog}
                    title="Decline Job"
                    message="Are you sure you want to decline this repair service?"
                    variant="danger"
                    confirmText="Decline"
                    cancelText="Keep Job"
                    confirmVariant="danger"
                    onConfirm={handleConfirmDecline}
                    onCancel={() => setShowDeclineDialog(false)}
                    onClose={() => setShowDeclineDialog(false)}
                />
            </View>

            {/* Prebuilt AlertDialog for Confirm */}
            <AlertDialog
                visible={showConfirmDialog}
                title="Job Confirmed"
                message="The mechanic has started the vehicle repair. You will receive updates as the fix progresses."
                variant="success"
                confirmText="Got it"
                onConfirm={() => setShowConfirmDialog(false)}
                onClose={() => setShowConfirmDialog(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    contentContainer: {
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
        gap: 16,
        paddingBottom: 48,
    },
    priceLabel: {
        color: "#000",
        backgroundColor: "#ffffff",
        paddingHorizontal: 18,
        paddingVertical: 4,
        borderRadius: 16,
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 8,
    },
    mechanicCard: {
        width: "100%",
        backgroundColor: "#171c21",
        borderRadius: 16,
        padding: 16,
    },
    mechanicRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 12,
    },
    mechanicLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    mechanicName: {
        fontSize: 16.5,
        fontWeight: "700",
        color: "#ffffff",
        flex: 1,
    },
    inProgressCard: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 148, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(0, 148, 255, 0.3)",
        borderRadius: 14,
        padding: 16,
        gap: 6,
    },
    inProgressTitle: {
        color: "#0094FF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    inProgressSubtitle: {
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 18,
        textAlign: "center",
    },
    cardSection: {
        width: "100%",
        padding: 18,
        alignItems: "center",
        gap: 10,
    },
    infoItem: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        width: "100%",
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: "#94A3B8",
        fontWeight: "500",
        textAlign: "center",
    },
    infoValue: {
        fontSize: 15,
        color: "#ffffff",
        fontWeight: "600",
        lineHeight: 20,
        textAlign: "center",
    },
    priceValue: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "800",
        textAlign: "center",
    },
    separator: {
        height: 1,
        width: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        marginVertical: 4,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 30,
        width: "100%",
        marginTop: 4,
    },
    actionBtn: {
        borderRadius: 50,
        flex: 1,
    },
    actionBtnFull: {
        width: "100%",
    },
});
