import {useEffect, useState} from "react";
import {ChildrenProps, ErrorType} from "@/types/general";
import {AuthContext} from "./AuthContext";
import {AuthProps, UserProfile, UserType} from "@/types/auth";
import {auth, db} from "@/config/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithCredential,
    FacebookAuthProvider,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import {LoginManager, AccessToken} from "react-native-fbsdk-next"
import {GoogleAuthProvider} from "firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {GOOGLE_CLIENT_ID} from "@/utils/renderSecrets";

export const AuthProvider = ({children}: ChildrenProps) => {
    const [user, setUser] = useState<UserType>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>(null);

    GoogleSignin.configure({
        webClientId: GOOGLE_CLIENT_ID, // From Firebase Console -> Google Provider,
    });

    // Automatically track changes to the auth state and fetch user profile from Firestore
    useEffect(() => {
        return auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    }
                } catch (err: any) {
                    console.error("Error fetching user profile:", err?.message || err);
                }
            } else {
                setUserProfile(null);
            }
            setIsLoading(false);
        });
    }, []);

    // Allows login using either email or username
    const loginWithEmail = async (userData: AuthProps) => {
        const identifier = (userData.username || userData.email || "").trim();
        const password = userData.password;

        if (!identifier || !password) {
            return setError("Please fill in all fields.");
        }

        setIsLoading(true);
        setError("");

        try {
            let emailToUse = identifier;

            // If identifier does not contain '@', look up email by username in Firestore
            if (!identifier.includes("@")) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", identifier), limit(1));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("No account found with this username.");
                    setIsLoading(false);
                    return;
                }

                const matchedDoc = querySnapshot.docs[0].data();
                emailToUse = matchedDoc.email;
            }

            await signInWithEmailAndPassword(auth, emailToUse, password);
        } catch (err: any) {
            setError(err.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    // Registers user in Firebase Auth and creates Firestore document with role "customer"
    const registerWithEmail = async (userData: AuthProps) => {
        const username = (userData.username || "").trim();
        const email = (userData.email || "").trim().toLowerCase();
        const password = userData.password;
        const phoneNumber = (userData.phoneNumber || "").trim();
        const fullName = (userData.fullName || "").trim();

        if (!username || !email || !password) {
            return setError("Please fill in all required fields.");
        }

        setIsLoading(true);
        setError("");

        try {
            // Check if username is already taken
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setError("Username is already taken. Please choose another.");
                setIsLoading(false);
                return;
            }

            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            // Create Firestore user document
            const newProfile: UserProfile = {
                uid,
                username,
                email,
                phoneNumber,
                fullName,
                role: "customer",
                createdAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", uid), newProfile);
            setUserProfile(newProfile);
        } catch (err: any) {
            setError(err.message || "An error occurred during sign up.");
        } finally {
            setIsLoading(false);
        }
    };

    // Cannot run in Expo Go
    const loginWithGoogle = async () => {
        try {
            try {
                // Check if Google Play Services are available (essential for Android)
                await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

                // Clear existing session so account picker shows
                try {
                    await GoogleSignin.signOut();
                } catch {
                }

                // Initiate the native pop-up login
                const signInResult = await GoogleSignin.signIn();

                const idToken = signInResult.data?.idToken;
                if (!idToken) {
                    throw new Error('Google Sign-In failed: No ID token returned.');
                }

                // Connect token to Firebase Auth Link
                const credential = GoogleAuthProvider.credential(idToken);

                // Sign into Firebase
                const userCredential = await signInWithCredential(auth, credential);

                // Ensure user profile exists in Firestore
                if (userCredential.user) {
                    const userDocRef = doc(db, "users", userCredential.user.uid);
                    const docSnap = await getDoc(userDocRef);

                    if (!docSnap.exists()) {
                        const googleProfile: UserProfile = {
                            uid: userCredential.user.uid,
                            username:
                                userCredential.user.displayName?.replace(/\s+/g, "").toLowerCase() ||
                                userCredential.user.email?.split("@")[0] ||
                                "user",
                            email: userCredential.user.email || "",
                            phoneNumber: userCredential.user.phoneNumber || "",
                            fullName: userCredential.user.displayName || "",
                            role: "customer",
                            createdAt: serverTimestamp(),
                        };
                        await setDoc(userDocRef, googleProfile);
                        setUserProfile(googleProfile);
                    } else {
                        setUserProfile(docSnap.data() as UserProfile);
                    }
                }

                return userCredential.user;
            } catch (err: any) {
                setError(err.message || "An error occurred during Google Sign-In.");
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        }
    };

    const loginWithApple = async () => {
        console.log("loginWithApple");
        // https://docs.expo.dev/versions/latest/sdk/apple-authentication/
    };

    const loginWithFacebook = async () => {
        setIsLoading(true);
        setError("");
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile", "email"])
            if (result.isCancelled) {
                setIsLoading(false);
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                throw new Error("No facebook access token");
            }

            const credential = FacebookAuthProvider.credential(data.accessToken);

            const userCredential = await signInWithCredential(auth, credential)

            if (userCredential.user) {
                const userDocRef = doc(db, "users", userCredential.user.uid);
                const docSnap = await getDoc(userDocRef);

                if (!docSnap.exists()) {
                    const fbProfile: UserProfile = {
                        uid: userCredential.user.uid,
                        username:
                            userCredential.user.displayName?.replace(/\s+/g, "").toLowerCase() ||
                            userCredential.user.email?.split("@")[0] ||
                            "user",
                        email: userCredential.user.email || "",
                        phoneNumber: userCredential.user.phoneNumber || "",
                        role: "customer",
                        createdAt: serverTimestamp()
                    };
                    await setDoc(userDocRef, fbProfile);
                    setUserProfile(fbProfile);
                } else {
                    setUserProfile(docSnap.data() as UserProfile);
                }
            }
            return userCredential.user;
        } catch (err: any) {
            setError(err.message || "An error occurred during Facebook Sign-In.");
        } finally {
            setIsLoading(false);
        }
    };

    const sendPasswordReset = async (emailOrUsername: string): Promise<boolean> => {
        const identifier = (emailOrUsername || "").trim();

        if (!identifier) {
            setError("Please enter your email or username.");
            return false;
        }

        setIsLoading(true);
        setError("");

        try {
            let emailToUse = identifier;

            // If identifier does not contain '@', look up email by username in Firestore
            if (!identifier.includes("@")) {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", identifier), limit(1));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError("No account found with this username.");
                    setIsLoading(false);
                    return false;
                }

                const matchedDoc = querySnapshot.docs[0].data();
                emailToUse = matchedDoc.email;
            }

            await sendPasswordResetEmail(auth, emailToUse);
            return true;
        } catch (err: any) {
            let message = "An error occurred while sending reset email.";
            if (err?.code === "auth/user-not-found") {
                message = "No account found with this email address.";
            } else if (err?.code === "auth/invalid-email") {
                message = "Please enter a valid email address.";
            } else if (err?.code === "auth/too-many-requests") {
                message = "Too many requests. Please try again later.";
            } else if (err?.message) {
                message = err.message;
            }
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await GoogleSignin.signOut();
            LoginManager.logOut();
        } catch (e) {
            //
        }

        await signOut(auth);
        setError("");
        setUser(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            error,
            isAuthenticated: !!user,
            isLoading,
            logout,
            loginWithEmail,
            registerWithEmail,
            sendPasswordReset,
            loginWithGoogle,
            loginWithApple,
            loginWithFacebook,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;