import React, {useEffect, useLayoutEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import Mechanics from "@/constants/mechanics";
import {Avatar, Button, Rating} from "@/components/ui";
import {PaymentMethodSelector} from "@/components/maintenance/PaymentMethodSelector";
import type {Mechanic} from "@/types/mechanic";

export default function BookingScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const {mechanicId, fromTab, car, location, category} = useLocalSearchParams<{
        mechanicId: string;
        fromTab?: string;
        car?: string;
        location?: string;
        category?: string;
    }>();

    const [mechanic, setMechanic] = useState<Mechanic | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<string | null>("cash");

    useEffect(() => {
        if (mechanicId) {
            const found = Mechanics.find((m) => String(m.id) === String(mechanicId));
            setMechanic(found);
        }
    }, [mechanicId]);

    const flatFee = mechanic?.flat_fee ?? 0;
    const consultationFee = mechanic?.consultation_fee ?? 0;
    const totalAmount = flatFee + consultationFee;

    const handleBookFix = () => {
        const targetId = mechanic?.id ?? mechanicId;
        if (!targetId) return;

        router.replace({
            pathname: "/(drawer)/(tabs)/maintenance",
            params: {
                bookedMechanicId: String(targetId),
                bookedTimestamp: String(Date.now()),
                fromTab: fromTab || undefined,
                car: car || undefined,
                location: location || undefined,
                category: category || undefined,
                price: String(totalAmount),
            },
        });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <CustomHeader
                    title="Booking info"
                    showBackButton
                    headerInMiddle
                    onBackPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace({
                                pathname: "/(drawer)/(tabs)/maintenance",
                                params: {fromTab: fromTab || undefined},
                            });
                        }
                    }}
                />
            ),
        });
    }, [navigation, router, fromTab]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerProfile}>
                <Avatar
                    imageUrl={mechanic?.profileImage}
                    avatarSize={72}
                    avatarBorderRadius={36}
                    avatarBorderWidth={2}
                    avatarBorderColor="#ffffff"
                />
                <Text style={styles.mechanicName}>{mechanic?.names || "Mechanic"}</Text>
                {mechanic?.rating != null ? (
                    <Rating
                        mechanic={mechanic}
                        value={mechanic.rating}
                        variant="badge"
                        fromTab={fromTab}
                    />
                ) : null}
                {mechanic?.telephone ? (
                    <Text style={styles.mechanicPhone}>+{mechanic.telephone}</Text>
                ) : null}
            </View>

            <View style={styles.cardSection}>
                <View style={styles.row}>
                    <Text style={styles.label}>Car expertise</Text>
                    <Text style={styles.value} numberOfLines={2}>
                        {mechanic?.expertise?.join(", ") || "All vehicles"}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{mechanic?.location_name || "Nearby"}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Flat Fee:</Text>
                    <Text style={[styles.value, styles.price]}>€{flatFee}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Consultation Fee:</Text>
                    <Text style={[styles.value, styles.price]}>€{consultationFee}</Text>
                </View>

                <View style={[styles.row, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>€{totalAmount}</Text>
                </View>
            </View>

            <Text style={styles.disclaimerText}>
                Note: Booking fee is the charge for booking a fix. Additional fees would be
                added after autohelp's inspection.
            </Text>

            <PaymentMethodSelector
                selectedId={paymentMethod}
                onSelect={(id) => setPaymentMethod(id)}
            />

            <Button
                title="Book a fix"
                variant="danger"
                onPress={handleBookFix}
                style={styles.bookButton}
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
        justifyContent: "flex-start",
        paddingVertical: 24,
        paddingHorizontal: 16,
        gap: 16,
        paddingBottom: 48,
    },
    headerProfile: {
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    mechanicName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
    },
    mechanicPhone: {
        fontSize: 14,
        color: "#94A3B8",
    },
    cardSection: {
        width: "98%",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        padding: 16,
        gap: 12,
        marginVertical: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#94A3B8",
    },
    value: {
        fontSize: 14,
        color: "#ffffff",
        fontWeight: "500",
        maxWidth: "60%",
        textAlign: "right",
    },
    price: {
        fontWeight: "700",
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.08)",
        paddingTop: 12,
        marginTop: 4,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: "800",
        color: "#ffffff",
    },
    disclaimerText: {
        fontSize: 12.5,
        color: "#94A3B8",
        textAlign: "center",
        paddingHorizontal: 20,
        lineHeight: 18,
    },
    bookButton: {
        borderRadius: 50,
        minWidth: 160,
        marginTop: 8,
    },
});
