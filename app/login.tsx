import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginInputsScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <View style={styles.innerContainer}>
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.headerBlock}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitleText}>Insert your username and password</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.3)"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialDividerText}>Or log in with</Text>
            <View style={styles.socialIconsRow}>
              <TouchableOpacity style={styles.socialIconCircle}>
                <Image source={{ uri: 'https://icons8.com' }} style={styles.iconImage} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialIconCircle}>
                <Image source={{ uri: 'https://icons8.com' }} style={styles.iconImage} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialIconCircle}>
                <Image source={{ uri: 'https://icons8.com' }} style={styles.iconImage} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtonContainer}>
            <TouchableOpacity style={styles.formLoginButton} onPress={() => console.log('Log In Submit')}>
              <Text style={styles.formLoginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131921' },
  keyboardView: { flex: 1 },
  innerContainer: { flex: 1, paddingHorizontal: 30, justifyContent: 'space-between', paddingBottom: 40 },
  backButton: { marginTop: 15, alignSelf: 'flex-start', padding: 5 },
  backButtonText: { color: '#FFFFFF', fontSize: 26, fontWeight: 'bold' },
  logoContainer: { width: 140, height: 50, alignSelf: 'center' },
  logo: { width: '100%', height: '100%' },
  headerBlock: { marginTop: 20, alignItems: 'flex-start' },
  welcomeText: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  subtitleText: { fontSize: 14, color: '#a3a7b0' },
  formContainer: { marginTop: 20, gap: 25 },
  inputWrapper: { width: '100%' },
  inputLabel: { fontSize: 11, color: '#a3a7b0', marginBottom: 4 },
  input: { width: '100%', height: 35, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15, paddingVertical: 4 },
  socialSection: { alignItems: 'center', marginTop: 20 },
  socialDividerText: { fontSize: 12, color: '#a3a7b0', marginBottom: 16 },
  socialIconsRow: { flexDirection: 'row', gap: 16 },
  socialIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  iconImage: { width: 22, height: 22, resizeMode: 'contain' },
  actionButtonContainer: { width: '100%', marginTop: 20 },
  formLoginButton: { backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
  formLoginButtonText: { color: '#131921', fontSize: 16, fontWeight: 'bold' },
});
