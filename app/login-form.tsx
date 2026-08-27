// app/login-form.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";

const LoginForm: React.FC = () => {
  const router = useRouter(); // 👈 IMPORTANT: For navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    // Your login logic here
    setIsSubmitting(false);
  };

  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* 👇 BACK BUTTON - Goes back to homepage */}
          <Pressable 
            style={styles.backButton}
            onPress={() => router.push('/login')} // 👈 NAVIGATES TO HOMEPAGE
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>AUT</Text>
            </View>

            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Insert your username and password</Text>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#5a5c66"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    placeholderTextColor="#5a5c66"
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                    <Text style={styles.eyeToggle}>
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.orText}>Or log in with</Text>

              <View style={styles.socialContainer}>
                <Pressable style={styles.socialButton}>
                  <Text style={styles.socialText}>🍎</Text>
                </Pressable>
                <Pressable style={styles.socialButton}>
                  <Text style={styles.socialText}>f</Text>
                </Pressable>
                <Pressable style={styles.socialButton}>
                  <Text style={styles.socialText}>G</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={handleLogin}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.button,
                  styles.loginButton,
                  (pressed || isSubmitting) && styles.pressed,
                ]}
              >
                <Text style={styles.loginText}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Text>
              </Pressable>

              {/* 👇 REGISTER LINK - Goes to register */}
              <Pressable onPress={() => router.push('/register')}> 
                <Text style={styles.registerLink}>Register</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#5b9bff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    color: "#a3a7b0",
    fontSize: 14,
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    color: "#7e838d",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1.5,
    borderBottomColor: "#484e57",
    color: "#ffffff",
    fontSize: 15,
    paddingVertical: 4,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#484e57",
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color: "#ffffff",
    fontSize: 15,
    paddingVertical: 4,
  },
  eyeToggle: {
    color: "#7e838d",
    fontSize: 12,
    fontWeight: "600",
  },
  orText: {
    color: "#7e838d",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  socialText: {
    fontSize: 20,
    color: "#ffffff",
  },
  actions: {
    gap: 14,
    marginTop: 30,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#ffffff",
  },
  loginText: {
    color: "#161b22",
    fontSize: 16,
    fontWeight: "700",
  },
  registerLink: {
    color: "#5b9bff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LoginForm;