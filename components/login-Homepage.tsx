// app/login-form.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // For back icon

const YOUR_BACKEND_API_URL = "http://192.168.1.1:3000/api/login";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("uwitonzesonia2005@gmail.com");
  const [password, setPassword] = useState("**********");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(YOUR_BACKEND_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Welcome back!");
        router.replace("/home"); // Navigate to home page
      } else {
        Alert.alert("Login Failed", data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Server Error", "Cannot connect to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/login')} // Go back to homepage
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Insert your username and password</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
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

            {/* Social Logins */}
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

          {/* Buttons */}
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

            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Register</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161b22",
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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