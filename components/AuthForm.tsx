import {useState} from "react";
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
import {useRouter} from "expo-router";
import {useAuth} from "@/hooks/useAuth";
import {AuthProps} from "@/types/auth";
import {Ionicons} from "@react-native-vector-icons/ionicons"
interface AuthFormProps {
    action: "login" | "register" | "forgot-password";
}

export const AuthForm = ({action}: AuthFormProps) => {
    const isLogin = action === "login";
    const isRegister = action === "register";
    const isForgotPassword = action === "forgot-password";

    const {
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        loginWithFacebook,
        error,
        isLoading,
    } = useAuth();
    const router = useRouter();

    const [userData, setUserData] = useState<AuthProps>({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        fullName: "",
    });
    const [validationError, setValidationError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setValidationError(null);
        setSuccessMessage(null);

        if (isForgotPassword) {
            const identifier = (userData.email || userData.username || "").trim();
            if (!identifier) {
                setValidationError("Please enter your email or username.");
                return;
            }
            const success = await sendPasswordReset(identifier);
            if (success) {
                setSuccessMessage("Password reset link sent! Please check your email inbox.");
            }
        } else if (isLogin) {
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

    const getHeaderTitle = () => {
        if (isForgotPassword) return "Reset Password";
        if (isLogin) return "Welcome Back";
        return "Create Account";
    };

    const getSubTitle = () => {
        if (isForgotPassword) return "Enter your email or username to receive a reset link";
        if (isLogin) return "Enter your credentials to continue";
        return "Fill in your details to get started";
    };

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
                        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
                        <Text style={styles.subTitle}>{getSubTitle()}</Text>

                        {displayedError ? (
                            <View style={styles.errorBanner}>
                                <Text style={styles.errorText}>{displayedError}</Text>
                            </View>
                        ) : null}

                        {successMessage ? (
                            <View style={styles.successBanner}>
                                <Text style={styles.successText}>{successMessage}</Text>
                            </View>
                        ) : null}

                        <View style={styles.inputsWrapper}>
                            {/* Forgot Password Field: Email or Username */}
                            {isForgotPassword && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Email or Username</Text>
                                    <TextInput
                                        placeholder="Enter your email or username"
                                        placeholderTextColor="#999"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        textContentType="emailAddress"
                                        value={userData.email || userData.username}
                                        onChangeText={(text) =>
                                            setUserData((prev) => ({...prev, email: text, username: text}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Register-only: Your Name */}
                            {isRegister && (
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
                                            setUserData((prev) => ({...prev, fullName}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Register-only: Email */}
                            {isRegister && (
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
                                            setUserData((prev) => ({...prev, email}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Register-only: Phone number */}
                            {isRegister && (
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
                                            setUserData((prev) => ({...prev, phoneNumber}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Username Field (Login & Register) */}
                            {!isForgotPassword && (
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
                                            setUserData((prev) => ({...prev, username}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Password Field (Login & Register) */}
                            {!isForgotPassword && (
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        value={userData.password}
                                        onChangeText={(password) =>
                                            setUserData((prev) => ({...prev, password}))
                                        }
                                        style={styles.input}
                                    />
                                </View>
                            )}

                            {/* Forgot Password Link on Login Screen */}
                            {isLogin && (
                                <View style={styles.forgotPasswordRow}>
                                    <Pressable
                                        onPress={() => router.push("/(auth)/forgot-password")}
                                    >
                                        <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>

                        {/* Primary Submit Button */}
                        <TouchableOpacity
                            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff"/>
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {isForgotPassword
                                        ? "Send Reset Link"
                                        : isLogin
                                            ? "Login"
                                            : "Register"}
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Divider & Google Sign-In (Login & Register only) */}
                        {!isForgotPassword && (
                            <>
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine}/>
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine}/>
                                </View>

                                <TouchableOpacity
                                    style={styles.googleButton}
                                    onPress={loginWithGoogle}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={"logo-google"} size={24}/>
                                    <Text style={styles.googleButtonText}>
                                        {isLogin ? "Sign in with Google" : "Sign up with Google"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.googleButton, {marginTop: 20}]}
                                    onPress={loginWithFacebook}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name={"logo-facebook"} size={24}/>
                                    <Text style={styles.googleButtonText}>
                                        {isLogin ? "Sign in with Facebook" : "Sign up with Facebook"}
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {/* Navigation switch between Screens */}
                        {isForgotPassword ? (
                            <View style={styles.switchAuthContainer}>
                                <Text style={styles.switchAuthText}>Remember your password?</Text>
                                <Pressable
                                    onPress={() => router.replace("/(auth)/login")}
                                >
                                    <Text style={styles.switchAuthLink}> Login</Text>
                                </Pressable>
                            </View>
                        ) : (
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
                        )}
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
    successBanner: {
        width: "100%",
        backgroundColor: "#ecfdf5",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#a7f3d0",
    },
    successText: {
        color: "#047857",
        fontSize: 13,
        textAlign: "center",
        fontWeight: "500",
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
    forgotPasswordRow: {
        width: "100%",
        alignItems: "flex-end",
        marginTop: 2,
        marginBottom: 4,
    },
    forgotPasswordLink: {
        fontSize: 13,
        fontWeight: "600",
        color: "#0284c7",
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

