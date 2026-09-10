import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";
import { UseAuthFormReturn } from "@/types/auth";
import { AuthPasswordInput, AuthTextInput } from "./AuthInput";

interface RegisterFormProps extends UseAuthFormReturn {
    onInputFocus?: (field: "name" | "email" | "phone" | "username" | "password") => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    userData,
    showPassword,
    setShowPassword,
    isLoading,
    handleFieldChange,
    handleSubmit,
    onInputFocus,
}) => {
    const router = useRouter();
    const fullNameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const usernameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    return (
        <>
            <View style={styles.form}>
                <AuthTextInput
                    ref={fullNameRef}
                    placeholder="Your name"
                    value={userData.fullName}
                    onChangeText={(text) => handleFieldChange("fullName", text)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    autoComplete="name"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        emailRef.current?.focus();
                        onInputFocus?.("email");
                    }}
                    onFocus={() => onInputFocus?.("name")}
                    editable={!isLoading}
                />

                <AuthTextInput
                    ref={emailRef}
                    placeholder="email@example.com"
                    value={userData.email}
                    onChangeText={(text) => handleFieldChange("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        phoneRef.current?.focus();
                        onInputFocus?.("phone");
                    }}
                    onFocus={() => onInputFocus?.("email")}
                    editable={!isLoading}
                />

                <AuthTextInput
                    ref={phoneRef}
                    placeholder="phone number"
                    value={userData.phoneNumber}
                    onChangeText={(text) =>
                        handleFieldChange("phoneNumber", text.replace(/(?!^\+)[^\d]/g, ""))
                    }
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    returnKeyType="next"
                    onSubmitEditing={() => {
                        usernameRef.current?.focus();
                        onInputFocus?.("username");
                    }}
                    onFocus={() => onInputFocus?.("phone")}
                    editable={!isLoading}
                />

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
                    textContentType="newPassword"
                    autoComplete="new-password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    onFocus={() => onInputFocus?.("password")}
                    editable={!isLoading}
                />
            </View>

            <View style={styles.buttons}>
                <Button
                    title="Register"
                    style={styles.primaryBtn}
                    textStyle={styles.primaryBtnText}
                    onPress={handleSubmit}
                    loading={isLoading}
                    loadingColor="#131921"
                    disabled={isLoading}
                />
                <Button
                    title="Login"
                    variant="outline"
                    style={styles.outlineBtn}
                    textStyle={styles.outlineBtnText}
                    onPress={() => router.push("/(auth)/login")}
                    disabled={isLoading}
                />
                <Button
                    type="link"
                    title="SIGN ON AS AN AUTOHELP"
                    style={styles.autohelpLink}
                    textStyle={styles.capsLink}
                    onPress={() => router.push("/(auth)/login")}
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
    buttons: {
        width: "100%",
        gap: 14,
        marginTop: 8,
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
    autohelpLink: {
        alignItems: "center",
        paddingVertical: 8,
        marginTop: 4,
    },
    capsLink: {
        fontSize: 12,
        color: "#a3a7b0",
        fontWeight: "700",
        letterSpacing: 1,
    },
});

export default RegisterForm;
