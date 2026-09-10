import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface AuthHeaderProps {
    title: string;
    subtitle: string;
    showBackground?: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
    title,
    subtitle,
    showBackground = false,
}) => {
    return (
        <>
            {showBackground && (
                <View style={styles.halfBgContainer} pointerEvents="none">
                    <Image
                        source={require("@/assets/login-bg.png")}
                        style={styles.halfBgImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={[
                            "rgba(15, 21, 29, 0.75)",
                            "rgba(15, 21, 29, 0.65)",
                            "#0f151d",
                        ]}
                        style={styles.halfBgGradient}
                    />
                </View>
            )}

            <View style={styles.logoRow}>
                <Image
                    source={require("@/assets/images/auto-logo.png")}
                    style={styles.logoImg}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.textBlock}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    halfBgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 320,
        overflow: "hidden",
    },
    halfBgImage: {
        width: "100%",
        height: "100%",
    },
    halfBgGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    logoImg: {
        width: 100,
        height: 50,
        resizeMode: "contain",
    },
    textBlock: {
        alignItems: "flex-start",
        gap: 6,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    subtitle: {
        fontSize: 13,
        color: "#a3a7b0",
    },
});

export default AuthHeader;
