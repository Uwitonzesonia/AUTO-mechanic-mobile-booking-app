import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const SLIDE_COUNT = 2;

const LoginHomepage: React.FC = () => {
  const router = useRouter();
  const [activeSlide] = useState(0);

  return (
    <View style={styles.page}>
      <Image
        source={require("../assets/login-bg.png")}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.layers}>
        <View style={styles.overlay} />
        <View style={styles.bottomShade} />

        <View style={styles.content}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.bottomContent}>
            <Text style={styles.title}>Lets Get{"\n"}started with us</Text>

            <Text style={styles.description}>
              Get started with our service, designed for convenient repair
              bookings. Get acquainted with tools created to enhance vehicle
              ownership pleasures and help safeguard your vehicle against
              unprofessional repairs.
            </Text>

            <View style={styles.pagination}>
              {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === activeSlide ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={() => router.push("/login")}
                style={({ pressed }) => [
                  styles.button,
                  styles.loginButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.loginText}>Login</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/register")}
                style={({ pressed }) => [
                  styles.button,
                  styles.registerButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.registerText}>Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "#0b0d12",
  },
  background: {
    ...StyleSheet.absoluteFill,
  },
  layers: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5, 8, 12, 0.14)",
  },
  bottomShade: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: "54%",
    backgroundColor: "rgba(5, 8, 12, 0.86)",
  },
  content: {
    flex: 1,
    paddingTop: 34,
    paddingHorizontal: 26,
    paddingBottom: 18,
  },
  logo: {
    width: 112,
    height: 38,
    alignSelf: "center",
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 0,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    color: "#c2c4ca",
    fontSize: 10,
    lineHeight: 13,
    maxWidth: 270,
    marginBottom: 22,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 27,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#ffffff",
  },
  inactiveDot: {
    width: 6,
    backgroundColor: "#4a4c56",
  },
  actions: {
    gap: 7,
  },
  button: {
    width: "100%",
    height: 33,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#ffffff",
  },
  registerButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  loginText: {
    color: "#0b0d12",
    fontSize: 12,
    fontWeight: "600",
  },
  registerText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.75,
  },
});

export default LoginHomepage;
