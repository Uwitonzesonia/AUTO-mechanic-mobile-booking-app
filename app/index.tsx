import React, {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {Redirect} from "expo-router";
import OnboardingScreen from "@/app/onboarding";
import {useAuth} from "@/hooks/useAuth";
import {secureStorageEngine} from "@/utils/secureStore";

export default function Index() {
    const {isAuthenticated, isLoading: authLoading} = useAuth();
    const [checkingFirstTime, setCheckingFirstTime] = useState(!__DEV__);
    const [isFirstTime, setIsFirstTime] = useState(true);

    useEffect(() => {
        if (__DEV__) {
            return;
        }

        const checkFirstTime = async () => {
            try {
                const openFirstTime = await secureStorageEngine.getItem("openFirstTime");
                setIsFirstTime(!openFirstTime);
            } catch (error) {
                console.error("Error checking openFirstTime:", error);
                setIsFirstTime(true);
            } finally {
                setCheckingFirstTime(false);
            }
        };

        checkFirstTime();
    }, []);

    if (__DEV__) {
        return <OnboardingScreen/>;
    }

    if (checkingFirstTime || authLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF"/>
            </View>
        );
    }

    if (isFirstTime) {
        return <OnboardingScreen/>;
    }
    if (isAuthenticated) {
        return <Redirect href="/(drawer)/(tabs)"/>;
    }

    return <Redirect href="/(auth)/login"/>;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f151d",
    },
});

