import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  return (
    <ImageBackground
      source={require("../assets/login-bg.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.logoRow}>
                <Text style={styles.logoText}>AUT</Text>
                <Image
                  source={require("../assets/logo.png")}
                  style={styles.logoImg}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.textBlock}>
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>
                  Insert your username and password
                </Text>
              </View>

              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Yourname"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@example.com"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="phone number"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType="phone-pad"
                />

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={user}
                    onChangeText={setUser}
                    autoCapitalize="none"
                  />
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={pass}
                    onChangeText={setPass}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                  <TouchableOpacity style={{ marginTop: 6 }}>
                    <Text style={styles.blueText}>Forgot Password</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.footerBlock}>
                <TouchableOpacity style={styles.whiteBtn}>
                  <Text style={styles.darkText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => router.push("/login")}
                >
                  <Text style={styles.capsLink}>SIGN ON AS AN AUTOHELP</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(19, 25, 33, 0.75)" },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "space-between",
    minHeight: "100%",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 2,
  },
  logoImg: { width: 28, height: 28 },
  textBlock: { alignItems: "flex-start", marginTop: 10 },
  title: { fontSize: 42, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { fontSize: 13, color: "#a3a7b0", marginTop: 4 },
  form: { width: "100%", gap: 12, marginVertical: 20 },
  label: { fontSize: 11, color: "#a3a7b0", marginBottom: 2 },
  input: {
    width: "100%",
    height: 38,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.4)",
    color: "#FFFFFF",
    fontSize: 15,
  },
  blueText: { color: "#4a9eff", fontSize: 12, fontWeight: "600" },
  footerBlock: { width: "100%", alignItems: "center", marginTop: 10 },
  whiteBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  darkText: { color: "#131921", fontSize: 16, fontWeight: "bold" },
  capsLink: {
    fontSize: 12,
    color: "#a3a7b0",
    fontWeight: "700",
    letterSpacing: 1,
  },
});
