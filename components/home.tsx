import { Image, StyleSheet, View } from "react-native";

export default function Home() {
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
