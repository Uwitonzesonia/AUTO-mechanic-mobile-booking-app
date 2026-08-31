// app/login-page-2.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginPage2() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/login-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Back Button */}
          <Pressable 
            style={styles.backButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <View style={styles.mainContent}>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityBadgeText}>Quality number one</Text>
            </View>

            <Text style={styles.mainTitle}>
              Quality repair, assessment and training to guarantee easy repair, 
              testing for vehicle owners.
            </Text>

            <Text style={styles.description}>
              Active customer support to help customers in your comfort & lives.
            </Text>

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
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
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
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#5b9bff',
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  qualityBadge: {
    backgroundColor: 'rgba(91, 155, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  qualityBadgeText: {
    color: '#5b9bff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  mainTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 16,
  },
  description: {
    color: '#c8ccd6',
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 14,
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