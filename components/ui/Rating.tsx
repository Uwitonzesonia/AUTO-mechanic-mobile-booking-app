import React, {useCallback} from "react";
import {StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {Button} from "./Button";
import type {Mechanic} from "@/types/mechanic";

export interface RatingProps {
    /** Numeric rating value (e.g. 4.9). If omitted and mechanic is provided, mechanic.rating is used */
    value?: number | string;
    /** Mechanic data associated with this rating. When provided, tapping navigates to rating */
    mechanic?: Mechanic;
    /** Origin tab to return to after rating (e.g. 'garage', 'wallet') */
    fromTab?: string;
    /** Max number of stars for stars variant (default: 5) */
    maxStars?: number;
    /** Display variant: 'badge' (star + numeric text) or 'stars' (row of stars) */
    variant?: "badge" | "stars";
    /** Star icon size (default: 13) */
    size?: number;
    /** Star color (default: #FFB800) */
    color?: string;
    /** Whether to show numeric value next to stars in 'stars' variant */
    showValue?: boolean;
    /** Container style */
    style?: StyleProp<ViewStyle>;
    /** Text style for rating number */
    textStyle?: StyleProp<TextStyle>;
    /** Click handler. If provided, overrides default mechanic navigation */
    onPress?: (mechanic?: Mechanic) => void;
    /** Test identifier */
    testID?: string;
}

export const Rating: React.FC<RatingProps> = ({
    value,
    mechanic,
    fromTab,
    maxStars = 5,
    variant = "badge",
    size = 13,
    color = "#FFB800",
    showValue = true,
    style,
    textStyle,
    onPress,
    testID,
}) => {
    const router = useRouter();

    const resolvedValue = value ?? mechanic?.rating ?? 0;
    const numericValue = typeof resolvedValue === "string" ? parseFloat(resolvedValue) || 0 : resolvedValue;
    const formattedValue = numericValue.toFixed(1);

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress(mechanic);
            return;
        }

        if (mechanic) {
            if (router.canDismiss && router.canDismiss()) {
                router.dismissAll();
            }
            router.replace({
                pathname: "/(drawer)/(tabs)/maintenance",
                params: {
                    showRatingModal: "true",
                    ratingMechanicId: String(mechanic.id),
                    ratingMechanicData: JSON.stringify(mechanic),
                    fromTab: fromTab || undefined,
                },
            });
        }
    }, [onPress, mechanic, router, fromTab]);

    const isInteractive = Boolean(onPress || mechanic);

    if (variant === "stars") {
        const fullStars = Math.floor(numericValue);
        const hasHalfStar = numericValue - fullStars >= 0.5;

        const starsContent = (
            <>
                {Array.from({length: maxStars}).map((_, index) => {
                    let iconName: "star" | "star-half" | "star-outline" = "star-outline";
                    if (index < fullStars) {
                        iconName = "star";
                    } else if (index === fullStars && hasHalfStar) {
                        iconName = "star-half";
                    }

                    return (
                        <Ionicons
                            key={index}
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                })}
                {showValue && (
                    <Text style={[styles.starsValueText, {color}, textStyle]}>
                        {formattedValue}
                    </Text>
                )}
            </>
        );

        if (isInteractive) {
            return (
                <Button
                    variant="custom"
                    size="custom"
                    activeOpacity={0.7}
                    onPress={handlePress}
                    accessibilityLabel={`Rating ${formattedValue} stars`}
                    testID={testID}
                    style={[styles.starsContainer, style]}
                >
                    {starsContent}
                </Button>
            );
        }

        return (
            <View style={[styles.starsContainer, style]} testID={testID}>
                {starsContent}
            </View>
        );
    }

    // Default badge variant
    if (isInteractive) {
        return (
            <Button
                variant="custom"
                size="custom"
                activeOpacity={0.7}
                onPress={handlePress}
                accessibilityLabel={`Rating ${formattedValue} stars`}
                testID={testID}
                style={[styles.badgeContainer, style]}
            >
                <Ionicons name="star" size={size} color={color} />
                <Text style={[styles.badgeText, textStyle]}>{formattedValue}</Text>
            </Button>
        );
    }

    return (
        <View style={[styles.badgeContainer, style]} testID={testID}>
            <Ionicons name="star" size={size} color={color} />
            <Text style={[styles.badgeText, textStyle]}>{formattedValue}</Text>
        </View>
    );
};

export default Rating;

const styles = StyleSheet.create({
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4,
    },
    badgeText: {
        color: "#000000",
        fontSize: 12.5,
        fontWeight: "700",
    },
    starsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },
    starsValueText: {
        fontSize: 13,
        fontWeight: "700",
        marginLeft: 4,
    },
});
