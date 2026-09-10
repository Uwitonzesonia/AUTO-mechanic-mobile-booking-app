import React from "react";
import {
    ActivityIndicator,
    Modal,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

export interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    transparent?: boolean;
    indicatorColor?: string;
    size?: "small" | "large";
    style?: StyleProp<ViewStyle>;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message,
    transparent = true,
    indicatorColor = "#FFFFFF",
    size = "large",
    style,
}) => {
    if (!visible) return null;

    return (
        <Modal
            transparent={transparent}
            animationType="fade"
            visible={visible}
            statusBarTranslucent
            onRequestClose={() => {}}
        >
            <View style={[styles.overlay, style]}>
                <View style={[styles.card, !message && styles.compactCard]}>
                    <ActivityIndicator size={size} color={indicatorColor} />
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(10, 14, 20, 0.65)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    card: {
        backgroundColor: "rgba(22, 28, 38, 0.92)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        borderRadius: 20,
        paddingVertical: 22,
        paddingHorizontal: 26,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minWidth: 140,
        maxWidth: 280,
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    compactCard: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        minWidth: 76,
        borderRadius: 16,
    },
    message: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 0.2,
    },
});

export default LoadingOverlay;
