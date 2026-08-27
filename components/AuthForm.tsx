import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { AuthProps } from "@/types/auth";

interface AuthFormProps {
    action: "login" | "register";
}

export const AuthForm = ({ action }: AuthFormProps) => {
    const isLogin = action === "login";
    const { loginWithGoogle, loginWithEmail, registerWithEmail, error, isLoading } = useAuth();
    const router = useRouter();

    const [userData, setUserData] = useState<AuthProps>({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        fullName: "",
    });
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setValidationError(null);

        if (isLogin) {
            if (!userData.username || !userData.password) {
                setValidationError("Please enter both username and password.");
                return;
            }
            await loginWithEmail(userData);
        } else {
            if (!userData.fullName || !userData.email || !userData.phoneNumber || !userData.username || !userData.password) {
                setValidationError("Please fill in all required fields.");
                return;
            }
            await registerWithEmail(userData);
        }
    };

    const displayedError = validationError || error;

    return (
        <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formCard}>
                        <Text style={styles.headerTitle}>
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </Text>
                        <Text style={styles.subTitle}>
                            {isLogin
                                ? "Enter your credentials to continue"
                                : "Fill in your details to get started"}
                        </Text>

                        {displayedError ? (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{displayedError}</Text>
                            </View>
                        ) : null}

                        <View style={styles.inputsWrapper}>
                            {/* Register-only: Your Name */}
                            {!isLogin && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Your Name</Text>
                                    <TextInput
                                        placeholder="Enter your full name"
                                        placeholderTextColor="#999"
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        textContentType="name"
                                        value={userData.fullName}
                                        onChangeText={(fullName) =>
                                            setUserData((prev) => ({ ...prev, fullName }))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Register-only: Email */}
                            {!isLogin && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        placeholder="Enter your email"
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        textContentType="emailAddress"
                                        value={userData.email}
                                        onChangeText={(email) =>
                                            setUserData((prev) => ({ ...prev, email }))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Register-only: Phone number */}
                            {!isLogin && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Phone Number</Text>
                                    <TextInput
                                        placeholder="Enter your phone number"
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                        keyboardType="phone-pad"
                                        textContentType="telephoneNumber"
                                        value={userData.phoneNumber}
                                        onChangeText={(phoneNumber) =>
                                            setUserData((prev) => ({ ...prev, phoneNumber }))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Username Field (Always shown, used as identifier for Login) */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    placeholder={
                                        isLogin
                                            ? "Enter your username or email"
                                            : "Choose a username"
                                    }
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="username"
                                    value={userData.username}
                                    onChangeText={(username) =>
                                        setUserData((prev) => ({ ...prev, username }))
                                    }
                                    style={styles.input}
                                />
                            </View>

                            {/* Password Field (Both) */}
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    value={userData.password}
                                    onChangeText={(password) =>
                                        setUserData((prev) => ({ ...prev, password }))
                                    }
                                     style={styles.input}
                                />
                            </View>
                        </View>

                        {/* Primary Submit Button */}
                        <TouchableOpacity
                            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {isLogin ? "Login" : "Register"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Sign-In Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={loginWithGoogle}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.googleButtonText}>
                                {isLogin ? "Sign in with Google" : "Sign up with Google"}
                            </Text>
                        </TouchableOpacity>

                        {/* Navigation switch between Login & Register */}
                        <View style={styles.switchAuthContainer}>
                            <Text style={styles.switchAuthText}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </Text>
                            <Pressable
                                onPress={() =>
                                    router.replace(isLogin ? "/(auth)/register" : "/(auth)/login")
                                }
                            >
                                <Text style={styles.switchAuthLink}>
                                    {isLogin ? " Register" : " Login"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    formCard: {
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 6,
    },
    subTitle: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 20,
        textAlign: "center",
    },
    errorBanner: {
        width: "100%",
        backgroundColor: "#ffebee",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ffcdd2",
    },
    errorText: {
        color: "#d32f2f",
        fontSize: 13,
        textAlign: "center",
    },
    inputsWrapper: {
        width: "100%",
        marginBottom: 16,
    },
    fieldGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333333",
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#111827",
        backgroundColor: "#f9fafb",
    },
    primaryButton: {
        width: "100%",
        height: 48,
        backgroundColor: "#0284c7",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 6,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 18,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#e5e7eb",
    },
    dividerText: {
        marginHorizontal: 12,
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: "600",
    },
    googleButton: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
    },
    googleButtonText: {
        color: "#374151",
        fontSize: 15,
        fontWeight: "500",
    },
    switchAuthContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 22,
    },
    switchAuthText: {
        fontSize: 14,
        color: "#6b7280",
    },
    switchAuthLink: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0284c7",
    },
});
