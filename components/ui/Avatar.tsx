import React from "react";
import { Image, View, StyleSheet, StyleProp, ViewStyle, ImageStyle } from "react-native";

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
}

export const Avatar = ({
    imageUrl,
    avatarSize = 100,
    avatarBorderRadius = 50,
    avatarBackgroundColor = "transparent",
    avatarBorderColor = "transparent",
    avatarBorderWidth = 0,
    style,
    imageStyle,
    children,
}: AvatarProps) => {
    const dynamicStyles = {
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarBorderRadius,
        backgroundColor: avatarBackgroundColor,
        borderColor: avatarBorderColor,
        borderWidth: avatarBorderWidth,
    };

    return (
        <View style={[styles.container, { backgroundColor: avatarBackgroundColor }, style]}>
            {imageUrl && imageUrl.trim() !== "" ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, dynamicStyles, imageStyle]}
                />
            ) : (
                <View style={[dynamicStyles, styles.placeholder]}>
                    {children}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        resizeMode: "cover",
    },
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Avatar;