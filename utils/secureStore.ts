import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Replaces all unsupported characters with '_'
const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9._-]/g, "_");

export const secureStorageEngine = {
    getItem: async (key: string): Promise<string | null> => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && window.localStorage) {
                return window.localStorage.getItem(sanitizeKey(key));
            }
            return null;
        }
        try {
            return await SecureStore.getItemAsync(sanitizeKey(key));
        } catch (e) {
            console.error("SecureStore getItem error:", e);
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.setItem(sanitizeKey(key), value);
            }
            return;
        }
        try {
            await SecureStore.setItemAsync(sanitizeKey(key), value);
        } catch (e) {
            console.error("SecureStore setItem error:", e);
        }
    },
    removeItem: async (key: string): Promise<void> => {
        if (Platform.OS === "web") {
            if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.removeItem(sanitizeKey(key));
            }
            return;
        }
        try {
            await SecureStore.deleteItemAsync(sanitizeKey(key));
        } catch (e) {
            console.error("SecureStore removeItem error:", e);
        }
    }
};