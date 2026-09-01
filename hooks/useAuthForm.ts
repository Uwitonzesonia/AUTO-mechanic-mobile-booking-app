import { useState } from "react";
import { Keyboard } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { AuthAction, AuthProps, UseAuthFormReturn } from "@/types/auth";

export const useAuthForm = (action: AuthAction, onSuccess?: () => void): UseAuthFormReturn => {
    const isLogin = action === "login";
    const isForgotPassword = action === "forgot-password";

    const {
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        loginWithFacebook,
        loginWithApple,
        error,
        isLoading,
    } = useAuth();

    const [userData, setUserData] = useState<AuthProps>({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        fullName: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleFieldChange = (field: keyof AuthProps, value: string) => {
        setUserData((prev) => ({ ...prev, [field]: value }));
        if (validationError) setValidationError(null);
    };

    const handleSubmit = async () => {
        setValidationError(null);
        setSuccessMessage(null);
        Keyboard.dismiss();

        if (isForgotPassword) {
            const identifier = (userData.email || userData.username || "").trim();
            if (!identifier) {
                setValidationError("Please enter your email or username.");
                return;
            }
            const success = await sendPasswordReset(identifier);
            if (success) {
                setSuccessMessage("Password reset link sent! Check your inbox & spam folder.");
                onSuccess?.();
            }
        } else if (isLogin) {
            const identifier = (userData.username || userData.email || "").trim();
            if (!identifier || !userData.password) {
                setValidationError("Please enter both username and password.");
                return;
            }
            await loginWithEmail({
                username: identifier,
                password: userData.password,
            });
            onSuccess?.();
        } else {
            if (
                !userData.fullName?.trim() ||
                !userData.email?.trim() ||
                !userData.phoneNumber?.trim() ||
                !userData.username?.trim() ||
                !userData.password
            ) {
                setValidationError("Please fill in all required fields.");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email.trim())) {
                setValidationError("Please enter a valid email address.");
                return;
            }

            if (userData.password.length < 6) {
                setValidationError("Password must be at least 6 characters long.");
                return;
            }

            await registerWithEmail(userData);
            onSuccess?.();
        }
    };

    const displayedError =
        validationError || (typeof error === "string" ? error : error ? String(error) : null);

    return {
        userData,
        showPassword,
        setShowPassword,
        displayedError,
        successMessage,
        isLoading: !!isLoading,
        handleFieldChange,
        handleSubmit,
        loginWithApple,
        loginWithFacebook,
        loginWithGoogle,
    };
};

export default useAuthForm;
