import {User} from "firebase/auth";
import {ErrorType} from "@/types/general";

export type UserRole = "customer" | "mechanic" | "admin";

export interface UserProfile {
    uid: string;
    username: string;
    email: string;
    phoneNumber?: string;
    fullName?: string;
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

export interface AuthContextType {
    user: UserType;
    userProfile: UserProfile | null;
    error: ErrorType;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    loginWithEmail: (userData: AuthProps) => Promise<void>;
    registerWithEmail: (userData: AuthProps) => Promise<void>;
    loginWithGoogle: () => Promise<User | undefined>;
    loginWithFacebook: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    logout: () => Promise<void>;
}