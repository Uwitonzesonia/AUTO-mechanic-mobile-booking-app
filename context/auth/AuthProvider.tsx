import {useEffect, useState} from "react";
import {ChildrenProps, ErrorType} from "@/types/general";
import {AuthContext} from "./AuthContext";
import {AuthProps, UserType} from "@/types/auth";
import {auth} from "@/config/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    User
} from "firebase/auth";
import {GoogleAuthProvider} from "@firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

export const AuthProvider = ({children}: ChildrenProps) => {
    const [user, setUser] = useState<UserType>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    GoogleSignin.configure({
        // TODO: update credential
        webClientId: 'YOUR_WEB_CLIENT_://googleusercontent.com', // From Firebase Console -> Google Provider
    });

    // Automatically track changes to the login state stored in SecureStore
    useEffect(() => {
        return auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setIsLoading(false)
        });
    }, []);

    const loginWithEmail = async ({email, password}: AuthProps) => {
        if (!email || !password) return setError("Please fill in all fields.");
        setIsLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setError(error.message || "An error occurred during login in.");
        } finally {
            setIsLoading(false);
        }
    }

    const registerWithEmail = async ({email, password}: AuthProps) => {
        if (!email || !password) return setError("Please fill in all fields.");
        setIsLoading(true);
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            setError(error.message || "An error occurred during sign up.");
        } finally {
            setIsLoading(false);
        }
    }
    const loginWithGoogle = async () => {
        try {
            // TODO: update "iosUrlScheme" in app.json
            try {
                // Check if Google Play Services are available (essential for Android)
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

                // Initiate the native pop-up login
                const signInResult = await GoogleSignin.signIn();

                // Extract ID Token safely across package version variations
                const idToken = signInResult.data?.idToken || signInResult.data?.idToken;
                if (!idToken) {
                    throw new Error('Google Sign-In failed: No ID token returned.');
                }

                // Connect token to Firebase Auth Link
                const credential = GoogleAuthProvider.credential(idToken);

                // Sign into Firebase
                const userCredential = await signInWithCredential(auth, credential);
                return userCredential.user;

            } catch (error) {
               setError( "An error occurred during Google Sign-In.");
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        }
    }
    const loginWithApple = async () => {
        console.log("loginWithApple")
    }
    const loginWithFacebook = async () => {
        console.log("loginWithFacebook")
    }
    const logout = async () => {
        console.log("logout")
    }

    <AuthContext.Provider value={{
        user,
        error,
        isAuthenticated,
        isLoading,
        logout,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithApple,
        loginWithFacebook,
    }}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider;