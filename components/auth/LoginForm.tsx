import React, { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";
import { UseAuthFormReturn } from "@/types/auth";
import { AuthPasswordInput, AuthTextInput } from "./AuthInput";
import { AuthSocialButtons } from "./AuthSocialButtons";

interface LoginFormProps extends UseAuthFormReturn {
    onInputFocus?: (field: "username" | "password") => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    userData,
    showPassword,
    setShowPassword,
    isLoading,
    handleFieldChange,
    handleSubmit,
    loginWithApple,
    loginWithFacebook,
    loginWithGoogle,
    onInputFocus,
}) => {
    const router = useRouter();
    const usernameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    return (
        <>
            <View style={styles.form}>
                <AuthTextInput
                    ref={usernameRef}
                    placeholder="Username"
                    value={userData.username}
                    onChangeText={(text) => handleFieldChange("username", text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="username"
                    autoComplete="username"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        passwordRef.current?.focus();
                        onInputFocus?.("password");
                    }}
                    onFocus={() => onInputFocus?.("username")}
                    editable={!isLoading}
                />

                <AuthPasswordInput
                    ref={passwordRef}
                    showPassword={showPassword}
                    onToggleShowPassword={() => setShowPassword((prev) => !prev)}
                    value={userData.password}
                    onChangeText={(text) => handleFieldChange("password", text)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    autoComplete="current-password"
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                    onFocus={() => onInputFocus?.("password")}
                    editable={!isLoading}
                />

                <View style={styles.forgotPasswordRow}>
                    <Button
                        type="link"
                        title="Forgot password?"
                        textStyle={styles.forgotPasswordLink}
                        onPress={() => router.push("/(auth)/forgot-password")}
                        disabled={isLoading}
                    />
                </View>
            </View>

            <AuthSocialButtons
                onApplePress={loginWithApple}
                onFacebookPress={loginWithFacebook}
                onGooglePress={loginWithGoogle}
                isLoading={isLoading}
            />

            <View style={styles.buttons}>
                <Button
                    title="Login"
                    style={styles.primaryBtn}
                    textStyle={styles.primaryBtnText}
                    onPress={handleSubmit}
                    loading={isLoading}
                    loadingColor="#131921"
                    disabled={isLoading}
                />
                <Button
                    title="Register"
                    variant="outline"
                    style={styles.outlineBtn}
                    textStyle={styles.outlineBtnText}
                    onPress={() => router.push("/(auth)/register")}
                    disabled={isLoading}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    form: {
        width: "100%",
        gap: 18,
        marginBottom: 8,
    },
    forgotPasswordRow: {
        width: "100%",
        alignItems: "flex-start",
        marginTop: 2,
    },
    forgotPasswordLink: {
        fontSize: 13,
        fontWeight: "600",
        color: "#4a9eff",
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

export default LoginForm;
