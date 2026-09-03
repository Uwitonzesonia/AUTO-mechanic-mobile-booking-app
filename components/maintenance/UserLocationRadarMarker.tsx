import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LocationArrowMarker } from "./LocationArrowMarker";

interface UserLocationRadarMarkerProps {
    isSearching: boolean;
    size?: number;
}

export const UserLocationRadarMarker: React.FC<UserLocationRadarMarkerProps> = ({
    isSearching,
    size = 160,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isSearching) {
            // Pulse animation: smoothly scale up and down continuously
            const pulse = Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.25,
                            duration: 1100,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: false,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 0.85,
                            duration: 1100,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: false,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacityAnim, {
                            toValue: 0.6,
                            duration: 1100,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: false,
                        }),
                        Animated.timing(opacityAnim, {
                            toValue: 1,
                            duration: 1100,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: false,
                        }),
                    ]),
                ])
            );
            pulse.start();

            return () => {
                pulse.stop();
            };
        } else {
            // Settle to static non-scaling circle after search finishes
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [isSearching, scaleAnim, opacityAnim]);

    const circleStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    return (
        <View collapsable={false} style={[styles.container, { width: size + 40, height: size + 40 }]}>
            {/* White border circle (scaling while searching, static non-scaling after search) */}
            <Animated.View
                style={[
                    styles.radarCircle,
                    circleStyle,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            />

            {/* User Location Arrow in dead center */}
            <View style={styles.arrowCenter}>
                <LocationArrowMarker size={28} />
            </View>
        </View>
    );
};

export default UserLocationRadarMarker;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    radarCircle: {
        position: "absolute",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    arrowCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
});
