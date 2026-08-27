// app/register.tsx - REGISTER FORM
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !phoneNumber || !username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Account created successfully!');
  };

  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Back Button */}
            <Pressable
              style={styles.backButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </Pressable>

            <View style={styles.content}>
              {/* Logo */}
              <View style={styles.header}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.logoText}>AUT</Text>
              </View>

              <Text style={styles.title}>Register</Text>
              <Text style={styles.subtitle}>Insert your username and passwords</Text>

              {/* Form */}
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
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email/username@domain.com"
                    placeholderTextColor="#5a5c66"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Phone number</Text>
                  <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Phone number"
                    placeholderTextColor="#5a5c66"
                    keyboardType="phone-pad"
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
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.eyeToggle}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Buttons */}
              <View style={styles.actions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.registerButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={handleRegister}
                >
                  <Text style={styles.registerText}>Register</Text>
                </Pressable>

                <Pressable onPress={() => router.push('/login-form')}>
                  <Text style={styles.signInLink}>SIGN UP AS AN AUTOHELP</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  backButton: {
    paddingVertical: 12,
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
  header: {
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
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#a3a7b0',
    fontSize: 14,
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    width: '100%',
  },
  label: {
    color: '#7e838d',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1.5,
    borderBottomColor: '#484e57',
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#484e57',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: 4,
  },
  eyeToggle: {
    color: '#7e838d',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    gap: 14,
    marginTop: 30,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButton: {
    backgroundColor: '#ffffff',
  },
  registerText: {
    color: '#161b22',
    fontSize: 16,
    fontWeight: '700',
  },
  signInLink: {
    color: '#5b9bff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});