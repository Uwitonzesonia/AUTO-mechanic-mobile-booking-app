import React from "react";
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
}: AvatarProps) => {
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
    };

    return (
        <View style={[containerStyle, style]}>
            {imageUrl && imageUrl.trim() !== "" ? (
                <Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, imageStyle]}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.placeholder}>
                    {children || <Ionicons name="person" size={avatarSize * 0.5} color="#0094ff" />}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    placeholder: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Avatar;