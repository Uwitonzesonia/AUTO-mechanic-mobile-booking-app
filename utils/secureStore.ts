import * as SecureStore from "expo-secure-store";

export const secureStorageEngine = {
    getItem: async (key: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        return await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
        return await SecureStore.deleteItemAsync(key);
    }
};