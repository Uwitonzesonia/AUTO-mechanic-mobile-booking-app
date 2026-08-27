// app/login.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Header with Logo */}
            <View style={styles.header}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>AUT</Text>
            </View>

            {/* Main Content - Centered */}
            <View style={styles.content}>
              <Text style={styles.title}>
                Lets Get{"\n"}
                <Text style={styles.highlight}>started</Text> with us
              </Text>

              <Text style={styles.description}>
                Get started with using our service, design for convenience, repair bookings. 
                Get acquired with tools created to enhance vehicle experience and help 
                safeguard your vehicle against unprofessional repairs.
              </Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.loginButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => router.push('/login-form')}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.registerButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => router.push('/register')}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
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
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 30,
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
    lineHeight: 50,
    marginBottom: 16,
  },
  highlight: {
    color: '#4a9eff',
  },
  description: {
    color: '#c8ccd6',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 50,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#161b22',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  registerButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});