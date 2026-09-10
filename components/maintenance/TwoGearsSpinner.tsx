import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export interface TwoGearsSpinnerProps {
    /** Size of the primary gear. Secondary gear scales proportionally. Default is 26. */
    size?: number;
    /** Color of the gears. Default is #0094FF. */
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const TwoGearsSpinner: React.FC<TwoGearsSpinnerProps> = ({
    size = 26,
    color = "#0094FF",
    style,
}) => {
    const gearSpin = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(gearSpin, {
                toValue: 1,
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();
        return () => loop.stop();
    }, [gearSpin]);

    const spinInterpolate = gearSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const reverseSpinInterpolate = gearSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
    });

    const secondarySize = Math.round(size * (18 / 26));
    const width = Math.round(size * 1.7);
    const height = Math.round(size * 1.15);

    return (
        <View style={[styles.gearsPair, { width, height }, style]}>
            {/* Main Outlined Gear */}
            <Animated.View
                style={{
                    transform: [{ rotate: spinInterpolate }],
                }}
            >
                <Ionicons name="settings-outline" size={size} color={color} />
            </Animated.View>

            {/* Secondary Interlocking Outlined Gear */}
            <Animated.View
                style={[
                    styles.secondaryGear,
                    {
                        top: -Math.round(size * 0.15),
                        transform: [{ rotate: reverseSpinInterpolate }],
                    },
                ]}
            >
                <Ionicons name="settings-outline" size={secondarySize} color={color} />
            </Animated.View>
        </View>
    );
};

export default TwoGearsSpinner;

const styles = StyleSheet.create({
    gearsPair: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
    },
    secondaryGear: {
        position: "absolute",
        right: 0,
    },
});
