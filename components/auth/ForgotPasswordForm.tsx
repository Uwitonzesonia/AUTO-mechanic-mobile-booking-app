import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { Button } from "@/components/ui";
import { UseAuthFormReturn } from "@/types/auth";
import { AuthTextInput } from "./AuthInput";

export const ForgotPasswordForm: React.FC<UseAuthFormReturn> = ({
    userData,
    isLoading,
    handleFieldChange,
    handleSubmit,
}) => {
    const router = useRouter();
    const emailRef = useRef<TextInput>(null);

    return (
        <>
            <View style={styles.form}>
                <AuthTextInput
                    ref={emailRef}
                    placeholder="Email or Username"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                    value={userData.email || userData.username}
                    onChangeText={(text) => {
                        handleFieldChange("email", text);
                        handleFieldChange("username", text);
                    }}
                    editable={!isLoading}
                />

                <View style={styles.spamTipContainer}>
                    <Ionicons name="mail-outline" size={15} color="#a3a7b0" />
                    <Text style={styles.spamTipText}>
                        If you don't see our email in your inbox, please check your spam or junk folder.
                    </Text>
                </View>
            </View>

            <View style={styles.buttons}>
                <Button
                    title="Send Reset Link"
                    style={styles.primaryBtn}
                    textStyle={styles.primaryBtnText}
                    onPress={handleSubmit}
                    loading={isLoading}
                    loadingColor="#131921"
                    disabled={isLoading}
                />
                <Button
                    title="Back to Login"
                    variant="outline"
                    style={styles.outlineBtn}
                    textStyle={styles.outlineBtnText}
                    onPress={() => router.replace("/(auth)/login")}
                    disabled={isLoading}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    form: {
        width: "100%",
        gap: 16,
    },
    spamTipContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 2,
        marginTop: 4,
    },
    spamTipText: {
        flex: 1,
        fontSize: 12,
        color: "#a3a7b0",
        lineHeight: 17,
    },
    buttons: {
        width: "100%",
        gap: 14,
        marginTop: 12,
    },
    primaryBtn: {
        backgroundColor: "#FFFFFF",
        borderRadius: 40,
        width: "100%",
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    primaryBtnText: {
        color: "#131921",
        fontSize: 16,
        fontWeight: "700",
    },
    outlineBtn: {
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        borderRadius: 40,
        width: "100%",
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    outlineBtnText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});

export default ForgotPasswordForm;
