import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Button } from "@/components/ui/Button";

export interface BottomCardProps {
    title?: string;
    description?: string;
    searchingTitle?: string;
    searchingDescription?: string;
    readyTitle?: string;
    readyDescription?: string;
    services?: string[];
    selectedServices?: string[];
    onServiceToggle?: (service: string) => void;
    isSearching?: boolean;
    onSearchComplete?: () => void;
    style?: StyleProp<ViewStyle>;
}

const DEFAULT_SERVICES = ["Engine", "Maintenance", "Tires"];

export const BottomCard: React.FC<BottomCardProps> = ({
    title,
    description,
    searchingTitle = "Searching",
    searchingDescription = "Searching for Mechanics that fits your required category. Please hold on, this may take few minutes",
    readyTitle = "Choose an AutoExpert",
    readyDescription = "Pick an autoexpert to see work details, review and employ.",
    services = DEFAULT_SERVICES,
    selectedServices: controlledSelectedServices,
    onServiceToggle,
    isSearching = true,
    onSearchComplete,
    style,
}) => {
    // Internal selected services state if uncontrolled
    const [internalSelected, setInternalSelected] = useState<string[]>(["Maintenance"]);
    const activeServices = controlledSelectedServices ?? internalSelected;

    // Searching progress (0 to 4 filled bars)
    const [activeBars, setActiveBars] = useState<number>(1);
    const [searchDone, setSearchDone] = useState<boolean>(!isSearching);

    // Animation values for gear rotation
    const gearSpin = useRef(new Animated.Value(0)).current;

    // Handle service toggle
    const handleToggleService = (service: string) => {
        if (onServiceToggle) {
            onServiceToggle(service);
        } else {
            setInternalSelected((prev) =>
                prev.includes(service)
                    ? prev.filter((s) => s !== service)
                    : [...prev, service]
            );
        }
    };

    const onSearchCompleteRef = useRef(onSearchComplete);
    onSearchCompleteRef.current = onSearchComplete;

    // Animate 4 progress bars sequentially when searching
    useEffect(() => {
        if (!isSearching) {
            setSearchDone(true);
            return;
        }

        setSearchDone(false);
        setActiveBars(1);

        const interval = setInterval(() => {
            setActiveBars((prev) => {
                if (prev >= 4) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setSearchDone(true);
                        onSearchCompleteRef.current?.();
                    }, 400);
                    return 4;
                }
                return prev + 1;
            });
        }, 900);

        return () => clearInterval(interval);
    }, [isSearching]);

    // Spin animation for gears when search completes
    useEffect(() => {
        if (searchDone) {
            Animated.loop(
                Animated.timing(gearSpin, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [searchDone, gearSpin]);

    const spinInterpolate = gearSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const reverseSpinInterpolate = gearSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
    });

    // Dynamic Title & Description based on Searching vs Ready state
    const displayTitle = !searchDone
        ? title || searchingTitle
        : title || readyTitle;

    const displayDescription = !searchDone
        ? description || searchingDescription
        : description || readyDescription;

    return (
        <View style={[styles.cardContainer, style]}>
            {/* Top Handle Pill */}
            <View style={styles.handlePill} />

            {/* SECTION 1: Centered Dynamic Header Title & Description */}
            <View style={styles.headerSection}>
                <Text style={styles.titleText}>{displayTitle}</Text>
                <Text style={styles.descriptionText}>{displayDescription}</Text>
            </View>

            {/* SECTION 2: Outlined Button Row using shared Button component */}
            <View style={styles.servicesRow}>
                {services.map((service) => {
                    const isSelected = activeServices.includes(service);
                    return (
                        <Button
                            key={service}
                            variant="outline"
                            size="sm"
                            title={service}
                            onPress={() => handleToggleService(service)}
                            style={[
                                styles.serviceOutlineButton,
                                isSelected && styles.serviceSelectedButton,
                            ]}
                            textStyle={[
                                styles.serviceButtonText,
                                isSelected && styles.serviceSelectedText,
                            ]}
                            accessibilityLabel={`Select ${service} service`}
                        />
                    );
                })}
            </View>

            {/* SECTION 3: Searching Status (4 Progressive Bars OR 2 Outlined Blue Gears When Done) */}
            <View style={styles.statusSection}>
                {!searchDone ? (
                    <View style={styles.searchingContainer}>
                        {/* 4 White Bars (Grayed out initially, turning white as search goes) */}
                        <View style={styles.barsRow}>
                            {[1, 2, 3, 4].map((barIndex) => {
                                const isFilled = barIndex <= activeBars;
                                return (
                                    <View
                                        key={barIndex}
                                        style={[
                                            styles.progressBar,
                                            isFilled ? styles.barWhite : styles.barGrayed,
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    </View>
                ) : (
                    /* Search Finished: Two Outlined Gears Settings Icon in Blue */
                    <View style={styles.gearsContainer}>
                        <View style={styles.gearsPair}>
                            {/* Main Outlined Gear */}
                            <Animated.View
                                style={{
                                    transform: [{ rotate: spinInterpolate }],
                                }}
                            >
                                <Ionicons name="settings-outline" size={26} color="#0094FF" />
                            </Animated.View>

                            {/* Secondary Interlocking Outlined Gear */}
                            <Animated.View
                                style={[
                                    styles.secondaryGear,
                                    {
                                        transform: [{ rotate: reverseSpinInterpolate }],
                                    },
                                ]}
                            >
                                <Ionicons name="settings-outline" size={18} color="#0094FF" />
                            </Animated.View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

export default BottomCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#141A22",
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
        width: "100%",
    },
    handlePill: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.22)",
        alignSelf: "center",
        marginBottom: 12,
    },
    /* Section 1 */
    headerSection: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    titleText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FFFFFF",
        textAlign: "center",
        letterSpacing: 0.2,
    },
    descriptionText: {
        fontSize: 13,
        color: "#94A3B8",
        textAlign: "center",
        lineHeight: 18,
        marginTop: 5,
    },
    /* Section 2 */
    servicesRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        marginVertical: 16,
    },
    serviceOutlineButton: {
        flex: 1,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.18)",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        paddingVertical: 8,
        paddingHorizontal: 4,
        minHeight: 38,
        justifyContent: "center",
        alignItems: "center",
    },
    serviceSelectedButton: {
        borderColor: "#0094FF",
        backgroundColor: "rgba(0, 148, 255, 0.1)",
    },
    serviceButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#CBD5E1",
        textAlign: "center",
        includeFontPadding: false,
    },
    serviceSelectedText: {
        color: "#0094FF",
        fontWeight: "700",
    },
    /* Section 3 */
    statusSection: {
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    searchingContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    barsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
        paddingVertical: 6,
    },
    progressBar: {
        flex: 1,
        height: 5,
        borderRadius: 2.5,
    },
    barGrayed: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    barWhite: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#FFFFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 3,
    },
    /* Gears Complete State */
    gearsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 2,
    },
    gearsPair: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        width: 44,
        height: 30,
        justifyContent: "center",
    },
    secondaryGear: {
        position: "absolute",
        right: 0,
        top: -4,
    },
    gearsReadyText: {
        fontSize: 13.5,
        fontWeight: "700",
        color: "#0094FF",
        letterSpacing: 0.2,
    },
});