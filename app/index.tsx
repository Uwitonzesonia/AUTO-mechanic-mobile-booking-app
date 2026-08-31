// app/index.tsx
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import OnboardingScreen from './Onboarding';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3600);

    return () => clearTimeout(splashTimer);
  }, []);

  // Show Splash Screen
  if (showSplash) {
    return (
      <Pressable onPress={() => setShowSplash(false)} style={styles.container}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>
    );
  }

  // Show Onboarding
  return <OnboardingScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050608",
  },
  logo: {
    width: 220,
    height: 120,
  },
});