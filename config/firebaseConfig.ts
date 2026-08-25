// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
    FIREBASE_API_KEY, FIREBASE_APP_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET
} from "@/utils/renderSecrets";
import {initializeAuth, getReactNativePersistence } from '@firebase/auth';
import {secureStorageEngine} from "@/utils/secureStore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize authentication with our custom secure adapter
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(secureStorageEngine),
});