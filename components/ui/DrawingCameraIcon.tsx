import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export interface DrawingCameraIconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

// Lucide-style camera icon path in a 24x24 viewBox
const CAMERA_BODY_PATH =
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z';

export default function DrawingCameraIcon({
    size = 44,
    color = '#0094ff',
    strokeWidth = 2,
}: DrawingCameraIconProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(0.9)).current;
    const pupilAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        // Continuous smooth breathing and lens pulse loop
        const loop = Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1.08,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pupilAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0.9,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pupilAnim, {
                        toValue: 0.4,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        );

        loop.start();

        return () => loop.stop();
    }, [scaleAnim, pulseAnim, pupilAnim]);

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View
                style={[
                    styles.svgWrapper,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: pulseAnim,
                    },
                ]}
            >
                <Svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    {/* Camera outer body */}
                    <Path
                        d={CAMERA_BODY_PATH}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Outer lens ring */}
                    <Circle
                        cx={12}
                        cy={13}
                        r={3.2}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Center lens pupil / aperture */}
                    <Circle
                        cx={12}
                        cy={13}
                        r={1.4}
                        fill={color}
                    />

                    {/* Sensor / flash dot */}
                    <Circle
                        cx={17.5}
                        cy={8.5}
                        r={0.9}
                        fill={color}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    svgWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});