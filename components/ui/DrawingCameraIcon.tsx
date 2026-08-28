import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    interpolate,
    Extrapolation,
    Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

// lucide-style camera icon, 24x24 viewBox
const BODY_PATH =
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z';
const BODY_LENGTH = 65.4; // measured exactly, not eyeballed
const LENS_RADIUS = 3;
const LENS_CIRCUMFERENCE = 2 * Math.PI * LENS_RADIUS; // 18.85

const TOTAL_DURATION = 1000; // one full loop, ms

export default function DrawingCameraIcon({
                                              size = 64,
                                              color = '#2f9bff',
                                              strokeWidth = 2,
                                          }: {
    size?: number;
    color?: string;
    strokeWidth?: number;
}) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: TOTAL_DURATION, easing: Easing.linear }),
            -1, // infinite
            false, // don't reverse — snap back to 0 and redraw from scratch each loop
        );
    }, []);

    // body draws first, 0% -> 45% of the cycle
    const bodyAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: interpolate(
            progress.value,
            [0, 0.45],
            [BODY_LENGTH, 0],
            Extrapolation.CLAMP,
        ),
    }));

    // lens circle draws next, overlapping slightly, 35% -> 70%
    const lensAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: interpolate(
            progress.value,
            [0.35, 0.7],
            [LENS_CIRCUMFERENCE, 0],
            Extrapolation.CLAMP,
        ),
    }));

    // hold fully drawn from 70% -> 85%, then fade out 85% -> 100%
    const groupAnimatedProps = useAnimatedProps(() => ({
        opacity: interpolate(
            progress.value,
            [0, 0.85, 1],
            [1, 1, 0],
            Extrapolation.CLAMP,
        ),
    }));

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <AnimatedG animatedProps={groupAnimatedProps}>
                    <AnimatedPath
                        d={BODY_PATH}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={BODY_LENGTH}
                        animatedProps={bodyAnimatedProps}
                    />
                    <AnimatedCircle
                        cx={12}
                        cy={13}
                        r={LENS_RADIUS}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={LENS_CIRCUMFERENCE}
                        animatedProps={lensAnimatedProps}
                    />
                </AnimatedG>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center' },
});