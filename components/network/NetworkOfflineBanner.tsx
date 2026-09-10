import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Button } from "@/components/ui";

interface NetworkOfflineBannerProps {
    isOnline: boolean;
    hasConnectedInitially: boolean;
    isChecking: boolean;
    onRetry: () => Promise<boolean> | void;
}

export const NetworkOfflineBanner: React.FC<NetworkOfflineBannerProps> = ({
    isOnline,
    hasConnectedInitially,
    isChecking,
    onRetry,
}) => {
    const [bannerState, setBannerState] = useState<"hidden" | "offline" | "restored">("hidden");

    const translateY = useRef(new Animated.Value(50)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const prevOnlineRef = useRef(isOnline);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const animateIn = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const animateOut = (callback?: () => void) => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 50,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (callback) callback();
        });
    };

    useEffect(() => {
        if (!hasConnectedInitially) {
            setBannerState("hidden");
            translateY.setValue(50);
            opacity.setValue(0);
            return;
        }

        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }

        const wasOffline = !prevOnlineRef.current;
        const nowOnline = isOnline;
        prevOnlineRef.current = isOnline;

        if (!isOnline) {
            setBannerState("offline");
            animateIn();
        } else if (wasOffline && nowOnline) {
            setBannerState("restored");
            animateIn();

            hideTimerRef.current = setTimeout(() => {
                animateOut(() => setBannerState("hidden"));
            }, 2500);
        } else {
            if (bannerState !== "hidden") {
                animateOut(() => setBannerState("hidden"));
            }
        }

        return () => {
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
            }
        };
    }, [isOnline, hasConnectedInitially]);

    if (bannerState === "hidden") return null;

    const isRestored = bannerState === "restored";

    return (
        <SafeAreaView style={styles.container} pointerEvents="box-none">
            <Animated.View
                style={[
                    styles.banner,
                    {
                        backgroundColor: isRestored ? "#16A34A" : "#CC0000",
                        transform: [{ translateY }],
                        opacity,
                    },
                ]}
            >
                <View style={styles.content}>
                    <View style={styles.left}>
                        <Ionicons
                            name={isRestored ? "checkmark-circle" : "cloud-offline"}
                            size={16}
                            color="#ffffff"
                        />
                        <Text style={styles.text} numberOfLines={1}>
                            {isRestored ? "Back online" : "No connection"}
                        </Text>
                    </View>

                    {!isRestored && (
                        <Button
                            type="custom"
                            size="custom"
                            title="RETRY"
                            loading={isChecking}
                            disabled={isChecking}
                            onPress={() => onRetry()}
                            style={styles.retryButton}
                            textStyle={styles.retryText}
                            activeOpacity={0.75}
                        />
                    )}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

export default NetworkOfflineBanner;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        alignItems: "center",
        justifyContent: "flex-end",
    },
    banner: {
        width: "100%",
        height: 32,
        paddingHorizontal: 14,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 6,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    text: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
    },
    retryButton: {
        paddingHorizontal: 8,
        height: 22,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.22)",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 50,
    },
    retryText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});