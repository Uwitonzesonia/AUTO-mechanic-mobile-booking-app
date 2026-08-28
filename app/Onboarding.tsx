import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Image, StatusBar, SafeAreaView, FlatList, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const SLIDES = [
  { id: '1', type: 'car-intro', title: 'Lets Get', subtitle: 'started with us', desc: 'Get started with using our service, design for convenience, repair bookings. Get acquired with tools created to enhance vehicle ownership experience and help safeguard your vehicle against unprofessional repairs.', useFullBg: true },
  { id: '2', type: 'text-intro', title: 'Quality', subtitle: 'number one', desc: 'Quality repair, assessment and training to guarantee easy repair, testing for vehicle owners. Active customer support to help customers in your comfort & lives.', useFullBg: false },
  { id: '3', type: 'login', useFullBg: false },
  { id: '4', type: 'register', useFullBg: true }
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regYourname, setRegYourname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleScroll = (e: any) => { setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / width)); };
  const scrollToPage = (idx: number) => { flatListRef.current?.scrollToIndex({ index: idx, animated: true }); setCurrentPage(idx); };

  const renderItem = ({ item }: { item: any }) => {
    const logoHeader = (
      <View style={styles.logoRow}>
        <Text style={styles.logoText}>AUT</Text>
        <Image source={require('../assets/logo.png')} style={styles.logoImg} resizeMode="contain" />
      </View>
    );

    const dualButtons = () => (
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.whiteBtn} onPress={() => scrollToPage(2)}><Text style={styles.darkText}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={styles.borderBtn} onPress={() => scrollToPage(3)}><Text style={styles.whiteText}>Register</Text></TouchableOpacity>
      </View>
    );

    const slideContent = () => {
      if (item.type === 'car-intro' || item.type === 'text-intro') {
        return (
          <View style={styles.content}>
            {logoHeader}
            <View style={styles.textBlock}>
              <Text style={styles.titleLarge}>{item.title}{"\n"}<Text style={styles.whiteText}>{item.subtitle}</Text></Text>
              <Text style={styles.descText}>{item.desc}</Text>
            </View>
            {dualButtons()}
          </View>
        );
      }

      if (item.type === 'login') {
        return (
          <View style={styles.content}>
            {logoHeader}
            <View style={styles.textBlock}>
              <Text style={styles.titleLarge}>Welcome</Text>
              <Text style={styles.subLabel}>Insert your username and password</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Username</Text>
                <TextInput style={styles.input} value={loginUser} onChangeText={setLoginUser} autoCapitalize="none" />
              </View>
              <View style={styles.inputBox}>
                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} value={loginPass} onChangeText={setLoginPass} secureTextEntry autoCapitalize="none" />
              </View>
            </View>
            <View style={styles.socialBox}>
              <Text style={styles.subLabel}>Or log in with</Text>
              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}><Image source={{ uri: 'https://icons8.com' }} style={styles.socialIcon} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Image source={{ uri: 'https://icons8.com' }} style={styles.socialIcon} /></TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}><Image source={{ uri: 'https://icons8.com' }} style={styles.socialIcon} /></TouchableOpacity>
              </View>
            </View>
            {dualButtons()}
          </View>
        );
      }

      return (
        <View style={[styles.content, { zIndex: 10 }]}>
          {logoHeader}
          <View style={styles.textBlock}>
            <Text style={styles.titleLarge}>Register</Text>
            <Text style={styles.subLabel}>Insert your username and password</Text>
          </View>
          <View style={[styles.form, { gap: 10 }]}>
            <TextInput style={styles.input} value={regYourname} onChangeText={setRegYourname} placeholder="Yourname" placeholderTextColor="rgba(255,255,255,0.4)" />
            <TextInput style={styles.input} value={regEmail} onChangeText={setRegEmail} placeholder="email@example.com" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} value={regPhone} onChangeText={setRegPhone} placeholder="phone number" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="phone-pad" />
            <View>
              <Text style={styles.label}>Username</Text>
              <TextInput style={styles.input} value={regUser} onChangeText={setRegUser} autoCapitalize="none" />
            </View>
            <View>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} value={regPass} onChangeText={setRegPass} secureTextEntry autoCapitalize="none" />
              <TouchableOpacity style={styles.forgotLink}><Text style={styles.blueText}>Forgot Password</Text></TouchableOpacity>
            </View>
          </View>
          <View style={[styles.buttons, { marginTop: 10 }]}>
            <TouchableOpacity style={styles.whiteBtn} onPress={() => console.log('Register')}><Text style={styles.darkText}>Register</Text></TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => scrollToPage(2)}><Text style={styles.subLabel}>SIGN UP AS AN AUTOHELP</Text></TouchableOpacity>
          </View>
        </View>
      );
    };

    if (item.useFullBg) {
      return (
        <ImageBackground source={require('../assets/login-bg.png')} style={{ width, height, justifyContent: 'space-between', backgroundColor: '#131921' }} imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}>
          <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(19, 25, 33, 0.72)' }} />
          {slideContent()}
        </ImageBackground>
      );
    }

    return (
      <View style={{ width, height, justifyContent: 'space-between', backgroundColor: '#131921' }}>
        {slideContent()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FlatList ref={flatListRef} data={SLIDES} renderItem={renderItem} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScroll} />
        <View style={styles.dotRow}>
          {SLIDES.map((_, i) => ( <View key={i} style={[styles.dot, currentPage === i ? styles.activeDot : styles.inactiveDot]} /> ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131921' },
  page: { width, height, justifyContent: 'space-between', backgroundColor: '#131921' },
  bgImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bgHalfImg: { width: '100%', height: '48%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(19, 25, 33, 0.75)' },
  overlayLight: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(19, 25, 33, 0.2)' },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 50, justifyContent: 'space-between' },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
  logoText: { color: '#ffffff', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  logoImg: { width: 28, height: 28 },
  textBlock: { marginTop: 10, alignItems: 'flex-start' },
  titleLarge: { fontSize: 38, fontWeight: '800', color: '#4a9eff', textAlign: 'left', marginBottom: 12, lineHeight: 44 },
  whiteText: { color: '#FFFFFF' },
  descText: { fontSize: 14, color: '#a3a7b0', textAlign: 'left', lineHeight: 22 },
  subLabel: { fontSize: 13, color: '#a3a7b0' },
  form: { width: '100%', gap: 14 },
  inputBox: { width: '100%' },
  label: { fontSize: 11, color: '#a3a7b0', marginBottom: 4 },
  input: { width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 },
  forgotLink: { alignSelf: 'flex-start', marginTop: 8 },
  blueText: { color: '#4a9eff', fontSize: 12, fontWeight: '600' },
  socialBox: { alignItems: 'center', marginVertical: 10 },
  socialRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  socialBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  socialIcon: { width: 20, height: 20, resizeMode: 'contain' },
  buttons: { width: '100%', gap: 12 },
  whiteBtn: { backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' },
