import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

interface AlertBannerProps {
    message: string | null;
    tip?: string;
}

export const AuthErrorBanner: React.FC<AlertBannerProps> = ({ message }) => {
    if (!message) return null;
    return (
        <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={18} color="#fca5a5" />
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
};

export const AuthSuccessBanner: React.FC<AlertBannerProps> = ({ message, tip }) => {
    if (!message) return null;
    return (
        <View style={styles.successBanner}>
            <View style={styles.bannerRow}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#6ee7b7" />
                <Text style={styles.successText}>{message}</Text>
            </View>
            {tip ? (
                <View style={styles.tipRow}>
                    <Ionicons name="mail-outline" size={14} color="#a7f3d0" />
                    <Text style={styles.tipText}>{tip}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    errorBanner: {
        width: "100%",
        backgroundColor: "rgba(239, 68, 68, 0.15)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    errorText: {
        flex: 1,
        color: "#fca5a5",
        fontSize: 13,
        fontWeight: "500",
    },
    successBanner: {
        width: "100%",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 0.4)",
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        gap: 6,
    },
    bannerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    successText: {
        flex: 1,
        color: "#6ee7b7",
        fontSize: 13,
        fontWeight: "500",
    },
    tipRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingLeft: 26,
    },
    tipText: {
        flex: 1,
        color: "#a7f3d0",
        fontSize: 12,
        fontWeight: "400",
    },
});
