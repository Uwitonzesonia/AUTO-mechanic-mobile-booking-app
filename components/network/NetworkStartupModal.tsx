import React from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Button } from "@/components/ui";

interface NetworkStartupModalProps {
    visible: boolean;
    isChecking: boolean;
    onRetry: () => Promise<boolean> | void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const NetworkStartupModal: React.FC<NetworkStartupModalProps> = ({
    visible,
    isChecking,
    onRetry,
}) => {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => onRetry()}
        >
            <SafeAreaView style={styles.backdrop}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="cloud-offline-outline" size={32} color="#0094ff" />
                    </View>

                    <View style={styles.textGroup}>
                        <Text style={styles.title}>No Internet Connection</Text>
                        <Text style={styles.message}>
                            Please check your Wi-Fi or mobile data connection. The app will continue
                            automatically once connected.
                        </Text>
                    </View>

                    <Button
                        type="primary"
                        size="md"
                        fullWidth
                        title={isChecking ? "Checking Connection..." : "Try Again"}
                        loading={isChecking}
                        disabled={isChecking}
                        onPress={() => onRetry()}
                    />
                </View>
            </SafeAreaView>
        </Modal>
    );
};

export default NetworkStartupModal;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    card: {
        width: "100%",
        maxWidth: Math.min(SCREEN_WIDTH - 48, 360),
        backgroundColor: "#101822",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 18,
        elevation: 10,
        gap: 16,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(0, 148, 255, 0.12)",
        alignItems: "center",
        justifyContent: "center",
    },
    textGroup: {
        alignItems: "center",
        gap: 8,
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    message: {
        fontSize: 14,
        color: "#9ba8b8",
        textAlign: "center",
        lineHeight: 20,
    },
});
