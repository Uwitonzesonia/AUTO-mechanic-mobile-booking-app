import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "@react-native-vector-icons/fontawesome";
import { Button } from "@/components/ui";
import { GoogleIcon } from "@/utils/GoogleIcon";

interface AuthSocialButtonsProps {
    onApplePress: () => void;
    onFacebookPress: () => void;
    onGooglePress: () => void;
    isLoading?: boolean;
}

export const AuthSocialButtons: React.FC<AuthSocialButtonsProps> = ({
    onApplePress,
    onFacebookPress,
    onGooglePress,
    isLoading = false,
}) => {
    return (
        <View style={styles.socialBox}>
            <Text style={styles.socialTitle}>Log in with</Text>
            <View style={styles.socialRow}>
                <Button
                    size="icon"
                    style={styles.socialBtn}
                    icon={<FontAwesome name="apple" size={22} color="#000000" />}
                    onPress={onApplePress}
                    disabled={isLoading}
                    accessibilityLabel="Sign in with Apple"
                />
                <Button
                    size="icon"
                    style={styles.socialBtn}
                    icon={<FontAwesome name="facebook-f" size={20} color="#0072b1" />}
                    onPress={onFacebookPress}
                    disabled={isLoading}
                    accessibilityLabel="Sign in with Facebook"
                />
                <Button
                    size="icon"
                    style={styles.socialBtn}
                    icon={<GoogleIcon size={20} />}
                    onPress={onGooglePress}
                    disabled={isLoading}
                    accessibilityLabel="Sign in with Google"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    socialBox: {
        alignItems: "center",
        gap: 12,
        marginVertical: 4,
    },
    socialTitle: {
        fontSize: 13,
        color: "#a3a7b0",
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },
    socialBtn: {
        backgroundColor: "#FFFFFF",
        borderWidth: 0,
        borderRadius: 24,
        width: 48,
        height: 48,
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default AuthSocialButtons;
