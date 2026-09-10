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

// Initialize Firebase (safely handling Fast Refresh)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize authentication with our custom secure adapter
let authInstance;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(secureStorageEngine),
    });
} catch {
    authInstance = getAuth(app);
}
export const auth = authInstance;

// Initialize Firestore
export const db = getFirestore(app);
