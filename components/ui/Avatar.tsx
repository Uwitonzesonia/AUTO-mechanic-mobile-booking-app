import React, { useState } from "react";
import { Image, View, StyleSheet, StyleProp, ViewStyle, ImageStyle } from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export interface AvatarProps {
    imageUrl?: string;
    avatarSize?: number;
    avatarBorderRadius?: number;
    avatarBackgroundColor?: string;
    avatarBorderColor?: string;
    avatarBorderWidth?: number;
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    children?: React.ReactNode;
    onLoad?: () => void;
}

export const Avatar = ({
    imageUrl,
    avatarSize = 100,
    avatarBorderRadius = 50,
    avatarBackgroundColor = "rgba(0, 148, 255, 0.12)",
    avatarBorderColor = "transparent",
    avatarBorderWidth = 0,
    style,
    imageStyle,
    children,
    onLoad,
}: AvatarProps) => {
    const [hasError, setHasError] = useState(false);

    const innerSize = avatarSize - avatarBorderWidth * 2;

    const containerStyle: ViewStyle = {
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarBorderRadius,
        backgroundColor: avatarBackgroundColor,
        borderColor: avatarBorderColor,
        borderWidth: avatarBorderWidth,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    };

    const hasValidUrl = imageUrl && imageUrl.trim() !== "" && !hasError;

    return (
        <View style={[containerStyle, style]}>
            {/* Fallback Placeholder / Initial */}
            <View style={[styles.placeholder, { borderRadius: avatarBorderRadius }]}>
                {children || <Ionicons name="person" size={avatarSize * 0.5} color="#0094ff" />}
            </View>

            {/* Network Image */}
            {hasValidUrl ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[
                        {
                            width: innerSize,
                            height: innerSize,
                            borderRadius: avatarBorderRadius,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        },
                        imageStyle,
                    ]}
                    resizeMode="cover"
                    onLoad={onLoad}
                    onError={() => {
                        setHasError(true);
                    }}
                />
            ) : null}
        </View>
    );
};

export default Avatar;

const styles = StyleSheet.create({
    placeholder: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});