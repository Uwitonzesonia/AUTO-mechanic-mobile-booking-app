import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      router.replace("/login");
    }, 1800);

    return () => clearTimeout(splashTimer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
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
