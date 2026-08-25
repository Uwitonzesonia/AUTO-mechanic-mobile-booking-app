import {User} from "firebase/auth";
import {ErrorType} from "@/types/general";

export interface AuthContextType {
    user: UserType;
    error: ErrorType;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    loginWithEmail: ({email, password}: AuthProps) => Promise<void>;
    registerWithEmail: ({email, password}: AuthProps) => Promise<void>;
    loginWithGoogle: () => Promise<User | undefined>;
    loginWithFacebook: () => Promise<void>;
    loginWithApple: () => Promise<void>;
    logout: () => Promise<void>;
}

export type UserType = User | null;

export interface AuthProps {
    email: string;
    password: string;
}