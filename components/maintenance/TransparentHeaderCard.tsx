import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { SlideToCancelButton } from "./SlideToCancelButton";

export interface TransparentHeaderCardProps {
    onBackPress?: () => void;
    onCancelPress?: () => void;
    onProfilePress?: () => void;
    avatarUri?: string;
    style?: StyleProp<ViewStyle>;
}

export function TransparentHeaderCard({
    onBackPress,
    onCancelPress,
    onProfilePress,
    avatarUri,
    style,
}: TransparentHeaderCardProps) {
    const router = useRouter();
    const { user, userProfile } = useAuth();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else if (router.canGoBack()) {
            router.back();
        }
    };

    const handleProfile = () => {
        if (onProfilePress) {
            onProfilePress();
        } else {
            router.push("/(drawer)/(tabs)/profile");
        }
    };

    const profileImg =
        avatarUri ||
        user?.photoURL ||
        userProfile?.profileImage ||
        userProfile?.photoURL;

    return (
        <SafeAreaView edges={["top"]} style={[styles.safeArea, style]} pointerEvents="box-none">
            <View style={styles.headerRow} pointerEvents="box-none">
                {/* 1. Left: Back Button using updated Pressable-based Button component */}
                <Button
                    variant="secondary"
                    size="icon"
                    icon={<Ionicons name="chevron-back" size={24} color="#ffffff" />}
                    onPress={handleBack}
                    style={styles.backButton}
                    accessibilityLabel="Go back"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                />

                {/* 2. Middle: Interactive [x >> Slide to cancel] Slider */}
                <SlideToCancelButton onCancel={onCancelPress} />

                {/* 3. Right: Existing Shared Avatar Component with White Border */}
                <Pressable
                    onPress={handleProfile}
                    accessibilityRole="button"
                    accessibilityLabel="Profile"
                    style={styles.avatarWrapper}
                >
                    <Avatar
                        imageUrl={profileImg}
                        avatarSize={44}
                        avatarBorderRadius={22}
                        avatarBorderWidth={1.5}
                        avatarBorderColor="#ffffff"
                        avatarBackgroundColor="#141A22"
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

export default TransparentHeaderCard;

const styles = StyleSheet.create({
    safeArea: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        backgroundColor: "transparent",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#141A22",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.12)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    avatarWrapper: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});
