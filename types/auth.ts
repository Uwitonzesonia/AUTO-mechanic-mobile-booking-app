import { User } from "firebase/auth";
import { ErrorType } from "@/types/general";

export type UserRole = "customer" | "mechanic" | "admin";

export interface UserProfile {
    uid: string;
    username: string;
    email: string;
    phoneNumber?: string;
    fullName?: string;
    profileImage?: string;
    photoURL?: string;
    role: UserRole;
    createdAt?: any;
}

export type UserType = User | null;

export interface AuthProps {
    username: string;
    password: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
}

export type AuthAction = "login" | "register" | "forgot-password";

export interface AuthFormProps {
    action: AuthAction;
    onSuccess?: () => void;
}

export interface UseAuthFormReturn {
    userData: AuthProps;
    showPassword: boolean;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    displayedError: string | null;
    successMessage: string | null;
    isLoading: boolean;
    handleFieldChange: (field: keyof AuthProps, value: string) => void;
    handleSubmit: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    loginWithFacebook: () => Promise<any>;
    loginWithGoogle: () => Promise<any>;
}

export interface AuthContextType {
    user: UserType;
    userProfile: UserProfile | null;
    error: ErrorType;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    loginWithEmail: (userData: AuthProps) => Promise<void>;
    registerWithEmail: (userData: AuthProps) => Promise<void>;
    sendPasswordReset: (emailOrUsername: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<User | undefined>;
    loginWithFacebook: () => Promise<User | undefined>;
    loginWithApple: () => Promise<void>;
    logout: () => Promise<void>;
}
