import React from "react";
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";

interface LocationStateViewProps {
    hasPermission: boolean | null;
    onRetryPermission?: () => void;
}

export function LocationStateView({
                                      hasPermission,
                                      onRetryPermission,
                                  }: LocationStateViewProps) {
    if (hasPermission === false) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="location-outline" size={56} color="#ef4444"/>
                <Text style={styles.title}>Location Permission Needed</Text>
                <Text style={styles.subtitle}>
                    AUTO Mechanic requires your location to find mechanics near you.
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    activeOpacity={0.8}
                    onPress={onRetryPermission}
                >
                    <Text style={styles.retryButtonText}>Enable Location</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#ffffff"/>
            <Text style={styles.loadingText}>Acquiring your location...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#ffffff",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
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
