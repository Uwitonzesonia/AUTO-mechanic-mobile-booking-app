import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { getApp } from "@react-native-firebase/app";
import {
    getMessaging,
    getToken,
    onMessage,
    onTokenRefresh,
    setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// Configure Expo foreground notification presentation
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

let backgroundHandlerRegistered = false;

/**
 * Register background message handler early
 */
export function registerBackgroundHandler() {
    if (backgroundHandlerRegistered || Platform.OS === "web") return;
    try {
        const app = getApp();
        const messaging = getMessaging(app);
        setBackgroundMessageHandler(messaging, async (remoteMessage) => {
            console.log("[FCM] Background message received:", remoteMessage);
        });
        backgroundHandlerRegistered = true;
    } catch (err) {
        console.warn("[FCM] Could not register background handler:", err);
    }
}

/**
 * Configure Android notification channels
 */
export async function setupNotificationChannels() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("chat_channel", {
            name: "Chat Messages",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#0094ff",
            enableVibrate: true,
            showBadge: true,
        });

        await Notifications.setNotificationChannelAsync("default", {
            name: "General Notifications",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#0094ff",
        });
    }
}

/**
 * Request notification permissions across Expo & React Native Firebase
 */
export async function requestNotificationPermission(): Promise<boolean> {
    try {
        await setupNotificationChannels();

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                },
            });
            finalStatus = status;
        }

        return finalStatus === "granted";
    } catch (error) {
        console.warn("[FCM] Error requesting notification permissions:", error);
        return false;
    }
}

/**
 * Get device FCM Token (from Firebase Native or Expo fallback)
 */
export async function getFcmToken(): Promise<string | null> {
    try {
        const app = getApp();
        const messaging = getMessaging(app);
        const token = await getToken(messaging);
        if (token) {
            return token;
        }
    } catch (firebaseErr) {
        console.log("[FCM] Native Firebase getToken failed, attempting Expo fallback:", firebaseErr);
    }

    try {
        const expoTokenResult = await Notifications.getDevicePushTokenAsync();
        if (expoTokenResult?.data) {
            return expoTokenResult.data;
        }
    } catch (expoErr) {
        console.warn("[FCM] Could not obtain push token:", expoErr);
    }

    return null;
}

/**
 * Sync FCM Token to Firestore user profile
 */
export async function saveFcmTokenToUser(userId: string, token: string): Promise<void> {
    if (!userId || !token) return;
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            fcmToken: token,
            fcmUpdatedAt: serverTimestamp(),
            platform: Platform.OS,
        }).catch(async (updateError) => {
            // If user doc doesn't exist yet, merge create it
            await setDoc(userRef, {
                fcmToken: token,
                fcmUpdatedAt: serverTimestamp(),
                platform: Platform.OS,
            }, { merge: true });
        });
        console.log("[FCM] Successfully synced FCM token to Firestore user:", userId);
    } catch (error) {
        console.warn("[FCM] Failed to sync FCM token to Firestore:", error);
    }
}

/**
 * Setup listener to auto-refresh FCM token
 */
export function setupTokenRefreshListener(userId?: string): (() => void) | undefined {
    if (Platform.OS === "web") return undefined;
    try {
        const app = getApp();
        const messaging = getMessaging(app);
        return onTokenRefresh(messaging, async (newToken) => {
            console.log("[FCM] Token refreshed:", newToken);
            if (userId) {
                await saveFcmTokenToUser(userId, newToken);
            }
        });
    } catch (err) {
        console.warn("[FCM] Token refresh listener error:", err);
        return undefined;
    }
}

/**
 * Setup foreground push notification listener
 * Displays a local in-app banner when a push message is received in the foreground
 */
export function setupForegroundMessageListener(
    onMessageReceived?: (message: any) => void
): (() => void) | undefined {
    if (Platform.OS === "web") return undefined;
    try {
        const app = getApp();
        const messaging = getMessaging(app);

        return onMessage(messaging, async (remoteMessage) => {
            console.log("[FCM] Foreground message received:", remoteMessage);

            if (onMessageReceived) {
                onMessageReceived(remoteMessage);
            }

            // Trigger local notification banner if notification payload exists
            if (remoteMessage.notification) {
                const { title, body } = remoteMessage.notification;
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: title || "New Notification",
                        body: body || "",
                        data: remoteMessage.data || {},
                        sound: "default",
                        badge: 1,
                    },
                    trigger: null, // show immediately
                });
            }
        });
    } catch (err) {
        console.warn("[FCM] Foreground message listener error:", err);
        return undefined;
    }
}

/**
 * Setup notification click response listener
 */
export function setupNotificationClickListener(
    onNavigate: (chatId?: string, mechanicId?: string) => void
) {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.chatId || data?.mechanicId) {
            onNavigate(data.chatId as string, data.mechanicId as string);
        }
    });

    return () => {
        subscription.remove();
    };
}
