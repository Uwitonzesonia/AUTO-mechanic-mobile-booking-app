import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import OnboardingScreen from "@/app/onboarding";
import { useAuth } from "@/hooks/useAuth";
import { secureStorageEngine } from "@/utils/secureStore";
import { LoadingOverlay } from "@/components/ui";

export default function Index() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [checkingFirstTime, setCheckingFirstTime] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(false);

    useEffect(() => {
        const checkFirstTime = async () => {
            try {
                const openFirstTime = await secureStorageEngine.getItem("openFirstTime");
                setIsFirstTime(!openFirstTime);
            } catch (error) {
                console.error("Error checking openFirstTime:", error);
                setIsFirstTime(false);
            } finally {
                setCheckingFirstTime(false);
            }
        };

        checkFirstTime();
    }, []);

    const isLoading = checkingFirstTime || authLoading;

    if (isLoading) {
        return (
            <View style={styles.container}>
                <LoadingOverlay visible={true} />
            </View>
        );
    }

    if (isAuthenticated) {
        return <Redirect href="/(drawer)/(tabs)" />;
    }

    if (isFirstTime) {
        return <OnboardingScreen />;
    }

    return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
});
