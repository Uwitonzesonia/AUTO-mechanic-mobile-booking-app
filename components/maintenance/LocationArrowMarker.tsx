import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import FontAwesome from "@react-native-vector-icons/fontawesome";

interface LocationArrowMarkerProps {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const LocationArrowMarker: React.FC<LocationArrowMarkerProps> = ({
    size = 28,
    color = "#e40019",
    style,
}) => {
    return (
        <View collapsable={false} style={[styles.container, style]}>
            <FontAwesome
                name="location-arrow"
                size={size}
                color={color}
            />
        </View>
    );
};

export default LocationArrowMarker;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
