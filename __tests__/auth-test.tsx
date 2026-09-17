import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Login from "@/app/(auth)/login";
import Register from "@/app/(auth)/register";

// 1. Mock expo-router
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
    useRouter: () => ({
        push: mockPush,
        replace: mockReplace,
    }),
}));

// 2. Mock safe area context
jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// 3. Mock vector icons (both named and default exports)
jest.mock("@react-native-vector-icons/ionicons", () => {
    const { Text } = require("react-native");
    const MockIcon = ({ name, testID }: any) => (
        <Text testID={testID || `icon-${name}`}>{name}</Text>
    );
    return {
        __esModule: true,
        default: MockIcon,
        Ionicons: MockIcon,
    };
});

jest.mock("@react-native-vector-icons/fontawesome", () => ({
    __esModule: true,
    default: () => null,
    FontAwesome: () => null,
}));

jest.mock("@react-native-vector-icons/ant-design", () => ({
    __esModule: true,
    default: () => null,
    AntDesign: () => null,
}));

// 4. Mock useAuth functions and state
const mockLoginWithEmail = jest.fn();
const mockRegisterWithEmail = jest.fn();
const mockLoginWithGoogle = jest.fn();
const mockLoginWithFacebook = jest.fn();
const mockLoginWithApple = jest.fn();
const mockSendPasswordReset = jest.fn();

let mockAuthError: string | null = null;
let mockIsLoading = false;

jest.mock("@/hooks/useAuth", () => ({
    useAuth: () => ({
        user: null,
        userProfile: null,
        error: mockAuthError,
        isLoading: mockIsLoading,
        loginWithEmail: mockLoginWithEmail,
        registerWithEmail: mockRegisterWithEmail,
        loginWithGoogle: mockLoginWithGoogle,
        loginWithFacebook: mockLoginWithFacebook,
        loginWithApple: mockLoginWithApple,
        sendPasswordReset: mockSendPasswordReset,
        logout: jest.fn(),
    }),
}));

describe("Authentication Test Suite", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockAuthError = null;
        mockIsLoading = false;
    });

    // ==========================================
    // LOGIN SCREEN TESTS
    // ==========================================
    describe("<Login /> Screen", () => {
        test("renders all login inputs, buttons, and links", async () => {
            const { getByPlaceholderText, getByText } = await render(<Login />);

            expect(getByPlaceholderText("Username")).toBeTruthy();
            expect(getByPlaceholderText("Password")).toBeTruthy();
            expect(getByText("Login")).toBeTruthy();
            expect(getByText("Register")).toBeTruthy();
            expect(getByText("Forgot password?")).toBeTruthy();
        });

        test("shows validation error when submitting with empty fields", async () => {
            const { getByText } = await render(<Login />);

            const loginButton = getByText("Login");
            await fireEvent.press(loginButton);

            await waitFor(() => {
                expect(getByText("Please enter both username and password.")).toBeTruthy();
            });
            expect(mockLoginWithEmail).not.toHaveBeenCalled();
        });

        test("calls loginWithEmail with entered username and password", async () => {
            const { getByPlaceholderText, getByText } = await render(<Login />);

            const usernameInput = getByPlaceholderText("Username");
            const passwordInput = getByPlaceholderText("Password");
            const loginButton = getByText("Login");

            await fireEvent.changeText(usernameInput, "john_doe");
            await fireEvent.changeText(passwordInput, "secret123");
            await fireEvent.press(loginButton);

            await waitFor(() => {
                expect(mockLoginWithEmail).toHaveBeenCalledWith({
                    username: "john_doe",
                    password: "secret123",
                });
            });
        });

        test("toggles password visibility when eye icon is pressed", async () => {
            const { getByPlaceholderText, getByLabelText } = await render(<Login />);
            const passwordInput = getByPlaceholderText("Password");

            // Initially secure
            expect(passwordInput.props.secureTextEntry).toBe(true);

            // Toggle show password
            const toggleBtn = getByLabelText("Show password");
            await fireEvent.press(toggleBtn);

            expect(passwordInput.props.secureTextEntry).toBe(false);
        });

        test("navigates to Register and Forgot Password screens", async () => {
            const { getByText } = await render(<Login />);

            await fireEvent.press(getByText("Forgot password?"));
            expect(mockPush).toHaveBeenCalledWith("/(auth)/forgot-password");

            await fireEvent.press(getByText("Register"));
            expect(mockPush).toHaveBeenCalledWith("/(auth)/register");
        });

        test("displays backend error banner when useAuth returns an error", async () => {
            mockAuthError = "Invalid email or password.";
            const { getByText } = await render(<Login />);

            expect(getByText("Invalid email or password.")).toBeTruthy();
        });
    });

    // ==========================================
    // REGISTER SCREEN TESTS
    // ==========================================
    describe("<Register /> Screen", () => {
        test("renders all registration inputs", async () => {
            const { getByPlaceholderText, getByRole } = await render(<Register />);

            expect(getByPlaceholderText("Your name")).toBeTruthy();
            expect(getByPlaceholderText("email@example.com")).toBeTruthy();
            expect(getByPlaceholderText("phone number")).toBeTruthy();
            expect(getByPlaceholderText("Username")).toBeTruthy();
            expect(getByPlaceholderText("Password")).toBeTruthy();
            expect(getByRole("button", { name: "Register" })).toBeTruthy();
        });

        test("shows validation error when fields are empty", async () => {
            const { getByRole, getByText } = await render(<Register />);

            await fireEvent.press(getByRole("button", { name: "Register" }));

            await waitFor(() => {
                expect(getByText("Please fill in all required fields.")).toBeTruthy();
            });
            expect(mockRegisterWithEmail).not.toHaveBeenCalled();
        });

        test("shows validation error on invalid email address", async () => {
            const { getByPlaceholderText, getByRole, getByText } = await render(<Register />);

            await fireEvent.changeText(getByPlaceholderText("Your name"), "John Doe");
            await fireEvent.changeText(getByPlaceholderText("email@example.com"), "not-an-email");
            await fireEvent.changeText(getByPlaceholderText("phone number"), "0788123456");
            await fireEvent.changeText(getByPlaceholderText("Username"), "johndoe");
            await fireEvent.changeText(getByPlaceholderText("Password"), "123456");

            await fireEvent.press(getByRole("button", { name: "Register" }));

            await waitFor(() => {
                expect(getByText("Please enter a valid email address.")).toBeTruthy();
            });
            expect(mockRegisterWithEmail).not.toHaveBeenCalled();
        });

        test("shows validation error when password is shorter than 6 characters", async () => {
            const { getByPlaceholderText, getByRole, getByText } = await render(<Register />);

            await fireEvent.changeText(getByPlaceholderText("Your name"), "John Doe");
            await fireEvent.changeText(getByPlaceholderText("email@example.com"), "john@example.com");
            await fireEvent.changeText(getByPlaceholderText("phone number"), "0788123456");
            await fireEvent.changeText(getByPlaceholderText("Username"), "johndoe");
            await fireEvent.changeText(getByPlaceholderText("Password"), "123");

            await fireEvent.press(getByRole("button", { name: "Register" }));

            await waitFor(() => {
                expect(getByText("Password must be at least 6 characters long.")).toBeTruthy();
            });
            expect(mockRegisterWithEmail).not.toHaveBeenCalled();
        });

        test("calls registerWithEmail with valid registration credentials", async () => {
            const { getByPlaceholderText, getByRole } = await render(<Register />);

            await fireEvent.changeText(getByPlaceholderText("Your name"), "John Doe");
            await fireEvent.changeText(getByPlaceholderText("email@example.com"), "john@example.com");
            await fireEvent.changeText(getByPlaceholderText("phone number"), "0788123456");
            await fireEvent.changeText(getByPlaceholderText("Username"), "johndoe");
            await fireEvent.changeText(getByPlaceholderText("Password"), "secretPass123");

            await fireEvent.press(getByRole("button", { name: "Register" }));

            await waitFor(() => {
                expect(mockRegisterWithEmail).toHaveBeenCalledWith({
                    fullName: "John Doe",
                    email: "john@example.com",
                    phoneNumber: "0788123456",
                    username: "johndoe",
                    password: "secretPass123",
                });
            });
        });
    });
});
