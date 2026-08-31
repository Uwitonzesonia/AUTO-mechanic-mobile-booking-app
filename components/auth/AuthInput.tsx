import React, { forwardRef } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@react-native-vector-icons/ionicons";

export interface AuthTextInputProps extends TextInputProps {
    isError?: boolean;
}

export const AuthTextInput = forwardRef<TextInput, AuthTextInputProps>(
    ({ style, ...props }, ref) => {
        return (
            <TextInput
                ref={ref}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                style={[styles.input, style]}
                {...props}
            />
        );
    }
);

AuthTextInput.displayName = "AuthTextInput";

export interface AuthPasswordInputProps extends AuthTextInputProps {
    showPassword: boolean;
    onToggleShowPassword: () => void;
}

export const AuthPasswordInput = forwardRef<TextInput, AuthPasswordInputProps>(
    ({ showPassword, onToggleShowPassword, style, ...props }, ref) => {
        return (
            <View style={styles.passwordContainer}>
                <TextInput
                    ref={ref}
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    secureTextEntry={!showPassword}
                    style={[styles.passwordInput, style]}
                    {...props}
                />
                <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={onToggleShowPassword}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                >
                    <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={19}
                        color="rgba(255, 255, 255, 0.6)"
                    />
                </TouchableOpacity>
            </View>
        );
    }
);

AuthPasswordInput.displayName = "AuthPasswordInput";

const styles = StyleSheet.create({
    input: {
        width: "100%",
        height: 42,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.4)",
        color: "#FFFFFF",
        fontSize: 15,
        paddingHorizontal: 0,
    },
    passwordContainer: {
        width: "100%",
        height: 42,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.4)",
        flexDirection: "row",
        alignItems: "center",
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        color: "#FFFFFF",
        fontSize: 15,
        paddingHorizontal: 0,
    },
    eyeBtn: {
        paddingLeft: 8,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center",
    },
});
