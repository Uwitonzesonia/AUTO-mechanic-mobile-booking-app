import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Image, StatusBar, SafeAreaView, FlatList, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const SLIDES = [
  { id: '1', type: 'car-intro', title: 'Lets Get', subtitle: 'started with us', desc: 'Get started with using our service, design for convenience, repair bookings.', useFullBg: true },
  { id: '2', type: 'text-intro', title: 'Quality', subtitle: 'number one', desc: 'Quality repair, assessment and training to guarantee easy repair.', useFullBg: false },
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
        <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '800', letterSpacing: 2 }}>AUT</Text>
        <Image source={require('../assets/logo.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
      </View>
    );

    const dualButtons = () => (
      <View style={{ width: '100%', gap: 12 }}>
        <TouchableOpacity style={{ backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' }} onPress={() => scrollToPage(2)}><Text style={{ color: '#131921', fontSize: 16, fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'transparent', paddingVertical: 14, borderRadius: 25, borderWidth: 1.5, borderColor: '#FFFFFF', width: '100%', alignItems: 'center' }} onPress={() => scrollToPage(3)}><Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Register</Text></TouchableOpacity>
      </View>
    );

    const slideContent = () => {
      if (item.type === 'car-intro' || item.type === 'text-intro') {
        return (
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 50, justifyContent: 'space-between' }}>
            {logoHeader}
            <View style={{ marginTop: 10, alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 36, fontWeight: '800', color: '#FFFFFF', textAlign: 'left', marginBottom: 12, lineHeight: 44 }}>{item.title}{"\n"}<Text style={{ color: '#FFFFFF' }}>{item.subtitle}</Text></Text>
              <Text style={{ fontSize: 14, color: '#a3a7b0', textAlign: 'left', lineHeight: 22 }}>{item.desc}</Text>
            </View>
            {dualButtons()}
          </View>
        );
      }

      if (item.type === 'login') {
        return (
          <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 50, justifyContent: 'space-between' }}>
            {logoHeader}
            <View style={{ marginTop: 10, alignItems: 'flex-start' }}><Text style={{ fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>Welcome</Text><Text style={{ fontSize: 13, color: '#a3a7b0' }}>Insert your username and password</Text></View>
            <View style={{ width: '100%', gap: 14 }}>
              <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={loginUser} onChangeText={setLoginUser} placeholder="Username" placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" />
              <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={loginPass} onChangeText={setLoginPass} secureTextEntry placeholder="Password" placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" />
            </View>
            {dualButtons()}
          </View>
        );
      }

      return (
        <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 40, paddingBottom: 50, justifyContent: 'space-between', zIndex: 10 }}>
          {logoHeader}
          <View style={{ marginTop: 10, alignItems: 'flex-start' }}><Text style={{ fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>Register</Text></View>
          <View style={{ width: '100%', gap: 10 }}>
            <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={regYourname} onChangeText={setRegYourname} placeholder="Yourname" placeholderTextColor="rgba(255,255,255,0.4)" />
            <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={regEmail} onChangeText={setRegEmail} placeholder="email@example.com" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={regPhone} onChangeText={setRegPhone} placeholder="phone number" placeholderTextColor="rgba(255,255,255,0.4)" keyboardType="phone-pad" />
            <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={regUser} onChangeText={setRegUser} placeholder="Username" placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" />
            <TextInput style={{ width: '100%', height: 38, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF', fontSize: 15 }} value={regPass} onChangeText={setRegPass} secureTextEntry placeholder="Password" placeholderTextColor="rgba(255,255,255,0.4)" autoCapitalize="none" />
          </View>
          <View style={{ width: '100%', gap: 12, marginTop: 10 }}>
            <TouchableOpacity style={{ backgroundColor: '#FFFFFF', paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center' }} onPress={() => console.log('Register')}><Text style={{ color: '#131921', fontSize: 16, fontWeight: 'bold' }}>Register</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 5 }} onPress={() => scrollToPage(2)}><Text style={{ fontSize: 13, color: '#a3a7b0', fontWeight: '700' }}>SIGN UP AS AN AUTOHELP</Text></TouchableOpacity>
          </View>
        </View>
      );
    };

    if (item.useFullBg) {
      return (
        <ImageBackground source={require('../assets/login-bg.png')} style={{ width, height, justifyContent: 'space-between', backgroundColor: '#131921' }} imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(19, 25, 33, 0.72)' }} />
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#131921' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FlatList ref={flatListRef} data={SLIDES} renderItem={renderItem} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={handleScroll} />
        <View style={{ position: 'absolute', bottom: 25, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
          {SLIDES.map((_, i) => ( <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: currentPage === i ? '#FFFFFF' : 'rgba(255,255,255,0.2)' }} /> ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
