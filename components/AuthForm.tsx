import React, { useRef } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingOverlay } from "@/components/ui";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthFormProps } from "@/types/auth";
import {
    AuthErrorBanner,
    AuthHeader,
    AuthSuccessBanner,
    ForgotPasswordForm,
    LoginForm,
    RegisterForm,
} from "./auth";

export const AuthForm: React.FC<AuthFormProps> = ({ action, onSuccess }) => {
    const isLogin = action === "login";
    const isRegister = action === "register";
    const isForgotPassword = action === "forgot-password";

    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;
    const scrollViewRef = useRef<ScrollView>(null);

    const authFormState = useAuthForm(action, onSuccess);
    const { displayedError, successMessage, isLoading } = authFormState;

    const getHeaderInfo = () => {
        if (isForgotPassword) {
            return {
                title: "Reset Password",
                subtitle: "Enter your email or username to receive a reset link",
            };
        }
        if (isLogin) {
            return {
                title: "Welcome",
                subtitle: "Insert your username and password",
            };
        }
        return {
            title: "Register",
            subtitle: "Insert your username and password",
        };
    };

    const getLoadingMessage = () => {
        if (isForgotPassword) return "Sending reset link...";
        if (isLogin) return "Signing in...";
        return "Creating your account...";
    };

    const handleRegisterFocus = (field: "name" | "email" | "phone" | "username" | "password") => {
        const offsets: Record<typeof field, number> = {
            name: 0,
            email: 40,
            phone: 90,
            username: 150,
            password: 220,
        };
        scrollViewRef.current?.scrollTo({ y: offsets[field], animated: true });
    };

    const handleLoginFocus = (field: "username" | "password") => {
        if (field === "password") {
            scrollViewRef.current?.scrollTo({ y: 80, animated: true });
        }
    };

    const header = getHeaderInfo();

    return (
        <KeyboardAvoidingView
            style={[
                styles.container,
                { backgroundColor: isRegister ? "#0f151d" : "#131921" },
            ]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 16 : 24}
        >
            <LoadingOverlay
                visible={isLoading}
                message={getLoadingMessage()}
            />

            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContainer,
                    isLogin || isForgotPassword
                        ? styles.loginScrollContainer
                        : styles.registerScrollContainer,
                    isTablet && styles.tabletScrollContainer,
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
                <AuthHeader
                    title={header.title}
                    subtitle={header.subtitle}
                    showBackground={isRegister}
                />

                <AuthErrorBanner message={displayedError} />
                <AuthSuccessBanner message={successMessage} />

                {isLogin && (
                    <LoginForm
                        {...authFormState}
                        onInputFocus={handleLoginFocus}
                    />
                )}

                {isRegister && (
                    <RegisterForm
                        {...authFormState}
                        onInputFocus={handleRegisterFocus}
                    />
                )}

                {isForgotPassword && <ForgotPasswordForm {...authFormState} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 32,
        paddingTop: 24,
        paddingBottom: 160,
        gap: 20,
        position: "relative",
    },
    loginScrollContainer: {
        justifyContent: "center",
        paddingTop: 32,
    },
    registerScrollContainer: {
        justifyContent: "flex-start",
        paddingTop: 16,
    },
    tabletScrollContainer: {
        maxWidth: 500,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: 48,
    },
});

export default AuthForm;
