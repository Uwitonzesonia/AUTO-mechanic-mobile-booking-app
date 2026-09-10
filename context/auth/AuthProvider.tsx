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
    User,
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
import {secureStorageEngine} from "@/utils/secureStore";

export const AuthProvider = ({children}: ChildrenProps) => {
    const [user, setUser] = useState<UserType>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<ErrorType>(null);

    GoogleSignin.configure({
        webClientId: GOOGLE_CLIENT_ID, // From Firebase Console -> Google Provider,
    });

    // Helper to fetch existing profile by UID or email, or create only if brand new
    const getOrCreateUserProfile = async (currentUser: User): Promise<UserProfile> => {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }

        // Check if an existing profile already exists with this email
        const userEmail = (currentUser.email || "").trim().toLowerCase();
        if (userEmail) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", userEmail), limit(1));
            const qSnap = await getDocs(q);

            if (!qSnap.empty) {
                const existingData = qSnap.docs[0].data() as UserProfile;
                const mergedProfile: UserProfile = {
                    ...existingData,
                    uid: currentUser.uid,
                    profileImage: currentUser.photoURL || existingData.profileImage || undefined,
                };
                // Sync under current UID so future lookups by UID succeed immediately
                await setDoc(userDocRef, mergedProfile, {merge: true});
                return mergedProfile;
            }
        }

        // If no existing profile found, create a new one
        const newProfile: UserProfile = {
            uid: currentUser.uid,
            username:
                currentUser.displayName?.replace(/\s+/g, "").toLowerCase() ||
                userEmail.split("@")[0] ||
                "user",
            email: userEmail,
            phoneNumber: currentUser.phoneNumber || "",
            fullName: currentUser.displayName || "",
            profileImage: currentUser.photoURL || undefined,
            role: "customer",
            createdAt: serverTimestamp(),
        };

        await setDoc(userDocRef, newProfile);
        return newProfile;
    };

    // Helper to authenticate user by email when provider conflict happens
    const loginUserByExistingEmail = async (email: string, fallbackName?: string, fallbackPhoto?: string): Promise<User | undefined> => {
        const cleanEmail = (email || "").trim().toLowerCase();
        if (!cleanEmail) return undefined;

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", cleanEmail), limit(1));
        const qSnap = await getDocs(q);

        let profile: UserProfile;
        if (!qSnap.empty) {
            profile = qSnap.docs[0].data() as UserProfile;
        } else {
            const newUid = `user_${Date.now()}`;
            profile = {
                uid: newUid,
                username: cleanEmail.split("@")[0],
                email: cleanEmail,
                phoneNumber: "",
                fullName: fallbackName || cleanEmail.split("@")[0],
                profileImage: fallbackPhoto || undefined,
                role: "customer",
                createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, "users", newUid), profile);
        }

        const authenticatedUser: any = {
            uid: profile.uid,
            email: profile.email,
            displayName: profile.fullName || profile.username,
            phoneNumber: profile.phoneNumber || null,
            photoURL: profile.profileImage || fallbackPhoto || null,
            emailVerified: true,
        };

        await secureStorageEngine.setItem("active_user_uid", profile.uid);
        setUser(authenticatedUser);
        setUserProfile(profile);
        return authenticatedUser;
    };

    // Automatically track changes to the auth state and fetch/link user profile from Firestore
    useEffect(() => {
        return auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                try {
                    const profile = await getOrCreateUserProfile(currentUser);
                    await secureStorageEngine.setItem("active_user_uid", profile.uid);
                    setUserProfile(profile);
                } catch (err: any) {
                    console.error("Error fetching/syncing user profile:", err?.message || err);
                }
                setIsLoading(false);
            } else {
                // Check if we have an active session in secure store
                try {
                    const savedUid = await secureStorageEngine.getItem("active_user_uid");
                    if (savedUid) {
                        const docSnap = await getDoc(doc(db, "users", savedUid));
                        if (docSnap.exists()) {
                            const profile = docSnap.data() as UserProfile;
                            const restoredUser: any = {
                                uid: profile.uid,
                                email: profile.email,
                                displayName: profile.fullName || profile.username,
                                phoneNumber: profile.phoneNumber || null,
                                photoURL: profile.profileImage || null,
                                emailVerified: true,
                            };
                            setUser(restoredUser);
                            setUserProfile(profile);
                            setIsLoading(false);
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Error restoring session:", err);
                }
                setUser(null);
                setUserProfile(null);
                setIsLoading(false);
            }
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

            const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
            if (userCredential.user) {
                await secureStorageEngine.setItem("active_user_uid", userCredential.user.uid);
            }
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
            await secureStorageEngine.setItem("active_user_uid", uid);
            setUserProfile(newProfile);
        } catch (err: any) {
            setError(err.message || "An error occurred during sign up.");
        } finally {
            setIsLoading(false);
        }
    };

    // Google Sign-In with existing profile reuse and automatic fallback login
    const loginWithGoogle = async () => {
        setIsLoading(true);
        setError("");
        try {
            // Check if Google Play Services are available (essential for Android)
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

            // Clear existing session so account picker shows
            try {
                await GoogleSignin.signOut();
            } catch {
            }

            // Initiate native Google Sign-In
            const signInResult = await GoogleSignin.signIn();

            const idToken = signInResult.data?.idToken;
            if (!idToken) {
                setIsLoading(false);
                return;
            }

            const googleEmail = signInResult.data?.user?.email;
            const googleName = signInResult.data?.user?.name;
            const googlePhoto = signInResult.data?.user?.photo;

            // Connect token to Firebase Auth credential
            const credential = GoogleAuthProvider.credential(idToken);

            // Sign into Firebase
            try {
                const userCredential = await signInWithCredential(auth, credential);
                if (userCredential.user) {
                    const profile = await getOrCreateUserProfile(userCredential.user);
                    await secureStorageEngine.setItem("active_user_uid", profile.uid);
                    setUserProfile(profile);
                    return userCredential.user;
                }
            } catch (authErr: any) {
                // If account already exists with different credential, log in user immediately
                if (authErr?.code === "auth/account-exists-with-different-credential") {
                    console.log("Account already exists with different credential during Google login. Logging in user with matching email.");
                    const emailToUse = authErr.customData?.email || authErr.email || googleEmail;
                    if (emailToUse) {
                        return await loginUserByExistingEmail(emailToUse, googleName || undefined, googlePhoto || undefined);
                    }
                } else {
                    console.error("Google sign in auth error:", authErr);
                    setError(authErr.message || "An error occurred during Google Sign-In.");
                }
            }
        } catch (err: any) {
            console.error("loginWithGoogle error:", err);
            // Ignore cancellation or existing account conflict errors
            if (err?.code !== "SIGN_IN_CANCELLED" && err?.code !== "auth/account-exists-with-different-credential") {
                setError(err.message || "An error occurred during Google Sign-In.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithApple = async () => {
        console.log("loginWithApple");
        // https://docs.expo.dev/versions/latest/sdk/apple-authentication/
    };

    // Facebook Sign-In with existing profile reuse and automatic fallback login
    const loginWithFacebook = async () => {
        setIsLoading(true);
        setError("");
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
            if (result.isCancelled) {
                setIsLoading(false);
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                setIsLoading(false);
                return;
            }

            const credential = FacebookAuthProvider.credential(data.accessToken);

            try {
                const userCredential = await signInWithCredential(auth, credential);
                if (userCredential.user) {
                    const profile = await getOrCreateUserProfile(userCredential.user);
                    await secureStorageEngine.setItem("active_user_uid", profile.uid);
                    setUserProfile(profile);
                    return userCredential.user;
                }
            } catch (authErr: any) {
                // If account already exists with different credential, log in user immediately
                if (authErr?.code === "auth/account-exists-with-different-credential") {
                    console.log("Account already exists with different credential during Facebook login. Logging in user with matching email.");
                    let emailToUse = authErr.customData?.email || authErr.email;
                    let fbName: string | undefined;
                    let fbPhoto: string | undefined;

                    // Fetch profile info from Facebook Graph API if needed
                    try {
                        const fbResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${data.accessToken}`);
                        const fbData = await fbResponse.json();
                        if (fbData?.email) {
                            emailToUse = emailToUse || fbData.email;
                        }
                        fbName = fbData?.name;
                        fbPhoto = fbData?.picture?.data?.url;
                    } catch (fbErr) {
                        console.error("Facebook Graph API fetch error:", fbErr);
                    }

                    if (emailToUse) {
                        return await loginUserByExistingEmail(emailToUse, fbName, fbPhoto);
                    }
                } else {
                    console.error("Facebook sign in auth error:", authErr);
                    setError(authErr.message || "An error occurred during Facebook Sign-In.");
                }
            }
        } catch (err: any) {
            console.error("Facebook Sign-In error:", err);
            if (err?.code !== "auth/account-exists-with-different-credential") {
                setError(err.message || "An error occurred during Facebook Sign-In.");
            }
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

        try {
            await secureStorageEngine.removeItem("active_user_uid");
        } catch (e) {}

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
            isAuthenticated: !!user || !!userProfile,
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