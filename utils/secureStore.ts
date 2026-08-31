import * as SecureStore from "expo-secure-store";

// Replaces all unsupported characters with '_'
const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9._-]/g, "_");

export const secureStorageEngine = {
    getItem: async (key: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(sanitizeKey(key));
    },
    setItem: async (key: string, value: string): Promise<void> => {
        return await SecureStore.setItemAsync(sanitizeKey(key), value);
    },
    removeItem: async (key: string): Promise<void> => {
        return await SecureStore.deleteItemAsync(sanitizeKey(key));
    }
};