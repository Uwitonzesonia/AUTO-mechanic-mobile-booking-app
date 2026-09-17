import {getApp, getApps, initializeApp} from "firebase/app";
import {
    FIREBASE_API_KEY, FIREBASE_APP_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET
} from "@/utils/renderSecrets";
import {getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth";
import {secureStorageEngine} from "@/utils/secureStore";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

// Initialize Firebase (safely handling Fast Refresh and potential errors)
let appInstance;
try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
    console.warn("Firebase initializeApp warning:", e);
    appInstance = getApps().length > 0 ? getApp() : null;
}
export const app = appInstance as any;

// Initialize authentication with our custom secure adapter
let authInstance;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(secureStorageEngine),
    });
} catch {
    try {
        authInstance = getAuth(app);
    } catch (e) {
        console.warn("Auth initialization warning:", e);
    }
}
export const auth = authInstance as any;

// Initialize Firestore
let dbInstance;
try {
    dbInstance = getFirestore(app);
} catch (e) {
    console.warn("Firestore initialization warning:", e);
}
export const db = dbInstance as any;
