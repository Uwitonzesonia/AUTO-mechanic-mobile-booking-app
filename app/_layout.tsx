import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {Stack, useRouter, useSegments} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {SafeAreaView} from "react-native-safe-area-context";
import { AuthProvider, NetworkProvider } from "@/context";
import {useAuth} from "@/hooks/useAuth";
import AnimatedSplashScreen from "@/components/splash/AnimatedSplashScreen";
import {LoadingOverlay} from "@/components/ui";
import {
    registerBackgroundHandler,
    requestNotificationPermission,
    getFcmToken,
    saveFcmTokenToUser,
    setupTokenRefreshListener,
    setupNotificationClickListener,
} from "@/services/fcmService";

// Register background FCM handler early
registerBackgroundHandler();

export default function RootLayout() {
    return (
        <NetworkProvider>
            <AuthProvider>
                <SafeAreaView style={styles.safeArea}>
                    <RootContent/>
                </SafeAreaView>
            </AuthProvider>
        </NetworkProvider>
    );
}

function RootContent() {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <AnimatedSplashScreen onFinish={() => setShowSplash(false)}/>;
    }

    return <RootLayoutNav/>;
}

function RootLayoutNav() {
    const {isAuthenticated, isLoading, user} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inDrawerGroup = segments[0] === "(drawer)";

        if (!isAuthenticated && inDrawerGroup) {
            router.replace("/(auth)/login");
        } else if (isAuthenticated && (inAuthGroup || segments[0] === "onboarding")) {
            router.replace("/(drawer)/(tabs)");
        }

        SplashScreen.hideAsync();
    }, [isAuthenticated, isLoading, segments]);

    // Initialize real FCM token sync and push notification routing
    useEffect(() => {
        if (!isAuthenticated || !user?.uid) return;

        let isMounted = true;
        const initFcm = async () => {
            const hasPermission = await requestNotificationPermission();
            if (hasPermission && isMounted) {
                const token = await getFcmToken();
                if (token && user?.uid) {
                    await saveFcmTokenToUser(user.uid, token);
                }
            }
        };

        initFcm();

        const unsubscribeRefresh = setupTokenRefreshListener(user.uid);
        const unsubscribeClick = setupNotificationClickListener((chatId, mechanicId) => {
            if (chatId || mechanicId) {
                router.push({
                    pathname: "/(drawer)/messages/chat",
                    params: {
                        chatId: chatId || "",
                        mechanicId: mechanicId || "",
                    },
                });
            }
        });

        return () => {
            isMounted = false;
            if (unsubscribeRefresh) unsubscribeRefresh();
            if (unsubscribeClick) unsubscribeClick();
        };
    }, [isAuthenticated, user?.uid]);

    return (
        <View style={styles.container}>
            <LoadingOverlay visible={!!isLoading}/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="onboarding" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(drawer)" options={{headerShown: false}}/>
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
});