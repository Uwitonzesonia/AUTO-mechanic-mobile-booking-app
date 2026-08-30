import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, StatusBar, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>AUT</Text>
            <Image source={require('../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>Insert your username and password</Text>
          </View>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Username</Text>
              <TextInput style={styles.input} value={user} onChangeText={setUser} autoCapitalize="none" />
            </View>
            <View style={{ marginTop: 15 }}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} value={pass} onChangeText={setPass} secureTextEntry autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.socialBox}>
            <Text style={styles.subtitle}>Or log in with</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.circle}><Image source={{ uri: 'https://icons8.com' }} style={styles.icon} /></TouchableOpacity>
              <TouchableOpacity style={styles.circle}><Image source={{ uri: 'https://icons8.com' }} style={styles.icon} /></TouchableOpacity>
              <TouchableOpacity style={styles.circle}><Image source={{ uri: 'https://icons8.com' }} style={styles.icon} /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.whiteBtn}><Text style={styles.darkText}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={styles.borderBtn} onPress={() => router.push('/register')}><Text style={styles.whiteText}>Register</Text></TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131921' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 40, justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  logoText: { color: '#ffffff', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  logoImg: { width: 28, height: 28 },
  textBlock: { alignItems: 'flex-start', marginTop: 10 },
  title: { fontSize: 42, fontWeight: '800', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#a3a7b0', marginTop: 4 },
  form: { width: '100%' },
  label: { fontSize: 11, color: '#a3a7b0', marginBottom: 4 },
  input: { width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 },
  socialBox: { alignItems: 'center' },
  socialRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  circle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  icon: { width: 20, height: 20, resizeMode: 'contain' },
  buttons: { width: '100%', gap: 12 },
  whiteBtn: { backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
  darkText: { color: '#131921', fontSize: 16, fontWeight: 'bold' },
  borderBtn: { backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, borderColor: '#FFFFFF', width: '100%', alignItems: 'center' },
  whiteText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
