import {Stack, useRouter, useSegments} from "expo-router";
import AuthProvider from "@/context/auth/AuthProvider";
import {useAuth} from "@/hooks/useAuth";
import {useEffect, useState} from "react";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaView} from "react-native-safe-area-context";
import AnimatedSplashScreen from "@/components/splash/AnimatedSplashScreen";

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <AuthProvider>
            <SafeAreaView style={{flex: 1}}>
                <RootLayoutNav/>
            </SafeAreaView>
        </AuthProvider>
    )
}

function RootLayoutNav() {
    const {isAuthenticated, isLoading} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(auth)/login")
        } else if (isAuthenticated && inAuthGroup) {
            router.replace("/(tabs)")
        }

        SplashScreen.hideAsync();
    }, [isAuthenticated, isLoading, segments])

    if (isLoading) return null;

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="modal" options={{presentation: 'modal'}}/>
        </Stack>
    )
}