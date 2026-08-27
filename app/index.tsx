import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable, StyleSheet } from "react-native";

export default function Home() {
  const router = useRouter();

  const openLoginHomepage = () => {
    router.replace("/login");
  };

  useEffect(() => {
    const splashTimer = setTimeout(openLoginHomepage, 1800);

    return () => clearTimeout(splashTimer);
  }, [router]);

  return (
    <Pressable onPress={openLoginHomepage} style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </Pressable>
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