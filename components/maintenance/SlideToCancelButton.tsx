import React, {useRef} from "react";
import {Animated, LayoutChangeEvent, PanResponder, StyleProp, StyleSheet, Text, View, ViewStyle,} from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";

interface SlideToCancelButtonProps {
    onCancel?: () => void;
    style?: StyleProp<ViewStyle>;
}

const KNOB_SIZE = 34;
const KNOB_MARGIN = 4;

export const SlideToCancelButton: React.FC<SlideToCancelButtonProps> = ({
    onCancel,
    style,
}) => {
    const pan = useRef(new Animated.Value(0)).current;
    const currentPanX = useRef<number>(0);
    const maxSlideRef = useRef<number>(130);
    const isCancelled = useRef(false);

    // Keep maxSlideRef updated
    const updateMaxSlide = (width: number) => {
        maxSlideRef.current = Math.max(20, width - KNOB_SIZE - KNOB_MARGIN * 2);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 2;
            },
            onMoveShouldSetPanResponderCapture: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 2;
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
                isCancelled.current = false;
                pan.stopAnimation((value) => {
                    currentPanX.current = value;
                });
            },
            onPanResponderMove: (_, gestureState) => {
                const max = maxSlideRef.current;
                const newX = Math.max(0, Math.min(gestureState.dx, max));
                currentPanX.current = newX;
                pan.setValue(newX);
            },
            onPanResponderRelease: (_, gestureState) => {
                const max = maxSlideRef.current;
                const threshold = max * 0.65;

                if (gestureState.dx >= threshold || currentPanX.current >= threshold) {
                    // Slide completed! Animate to end and trigger cancel
                    Animated.timing(pan, {
                        toValue: max,
                        duration: 120,
                        useNativeDriver: true,
                    }).start(() => {
                        if (!isCancelled.current) {
                            isCancelled.current = true;
                            onCancel?.();

                            // Reset knob after short delay
                            setTimeout(() => {
                                Animated.spring(pan, {
                                    toValue: 0,
                                    friction: 7,
                                    tension: 45,
                                    useNativeDriver: true,
                                }).start(() => {
                                    isCancelled.current = false;
                                    currentPanX.current = 0;
                                });
                            }, 400);
                        }
                    });
                } else {
                    // Snap back to origin
                    Animated.spring(pan, {
                        toValue: 0,
                        friction: 7,
                        tension: 50,
                        useNativeDriver: true,
                    }).start(() => {
                        currentPanX.current = 0;
                    });
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(pan, {
                    toValue: 0,
                    friction: 7,
                    tension: 50,
                    useNativeDriver: true,
                }).start(() => {
                    currentPanX.current = 0;
                });
            },
        })
    ).current;

    const handleLayout = (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width;
        if (width > 0) {
            updateMaxSlide(width);
        }
    };

    // Fade out text & arrows as the knob slides
    const textOpacity = pan.interpolate({
        inputRange: [0, 60],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    return (
        <View
            style={[styles.track, style]}
            onLayout={handleLayout}
            {...panResponder.panHandlers}
            accessibilityRole="adjustable"
            accessibilityLabel="Slide to cancel"
        >
            {/* Center: Slide to cancel label + double chevrons (fades out during slide) */}
            <Animated.View style={[styles.contentRow, { opacity: textOpacity }]} pointerEvents="none">
                <View style={styles.chevrons}>
                    <Ionicons name="chevron-forward" size={11} color="#64748B" style={styles.firstChevron} />
                    <Ionicons name="chevron-forward" size={11} color="#94A3B8" />
                </View>
                <Text style={styles.cancelText}>Slide to cancel</Text>
            </Animated.View>

            {/* Draggable Knob [x] */}
            <Animated.View
                style={[
                    styles.knob,
                    {
                        transform: [{ translateX: pan }],
                    },
                ]}
                pointerEvents="none"
            >
                <Ionicons name="close" size={16} color="#ffffff" />
            </Animated.View>
        </View>
    );
};

export default SlideToCancelButton;

const styles = StyleSheet.create({
    track: {
        width: 175,
        maxWidth: 185,
        height: 44,
        backgroundColor: "#000000",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.16)",
        justifyContent: "center",
        paddingHorizontal: KNOB_MARGIN,
        marginHorizontal: 8,
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
    },
    contentRow: {
        position: "absolute",
        left: KNOB_SIZE + 6,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    chevrons: {
        flexDirection: "row",
        alignItems: "center",
    },
    firstChevron: {
        marginRight: -6,
    },
    cancelText: {
        color: "#CBD5E1",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.1,
    },
    knob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: "#191919",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        elevation: 4,
    },
});
