import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  SafeAreaView,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Lets Get',
    subtitle: 'started with us',
    desc: 'Get started with using our service, design for convenience, repair bookings. Get acquired with tools created to enhance vehicle experience and help safeguard your vehicle against unprofessional repairs.',
    bg: '#131921',
    useImageBg: true, 
  },
  {
    id: '2',
    title: 'Quality\nnumber one',
    subtitle: '',
    desc: 'Quality repair, assessment and training to guarantee easy repair, testing for vehicle owners. Active customer support to help customers in your comfort & lives.',
    bg: '#131921',
    useImageBg: false,
  },
  {
    id: '3',
    title: 'Your Title Here',
    subtitle: 'Your subtitle here',
    desc: 'Your description goes here. Add content for the third onboarding screen.',
    bg: '#131921',
    useImageBg: false,
  },
  {
    id: '4',
    title: 'Fourth Slide',
    subtitle: 'Subtitle',
    desc: 'Description for fourth slide.',
    bg: '#131921',
    useImageBg: false,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentPage < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    router.replace('/login');
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(index);
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    const slideContent = (
      <View style={styles.innerPageContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>
          {item.title}
          {item.subtitle ? (
            <>
              {"\n"}
              <Text style={styles.highlight}>{item.subtitle}</Text>
            </>
          ) : null}
        </Text>

        <Text style={styles.description}>{item.desc}</Text>
      </View>
    );
    if (item.useImageBg) {
      return (
        <ImageBackground
          source={require('../assets/login-bg.png')}
          style={[styles.page, { backgroundColor: item.bg }]}
          imageStyle={styles.bgImageStyle}
        >
          <View style={styles.gradientOverlay} />
          {slideContent}
        </ImageBackground>
      );
    }
    return (
      <View style={[styles.page, { backgroundColor: item.bg }]}>
        {slideContent}
      </View>
    );
  };
  const showAuthButtons = currentPage === 0 || currentPage === 1;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" transparent backgroundColor="transparent" />

      {!showAuthButtons && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      />

      <View style={styles.footer}>
        {showAuthButtons ? (
          <View style={styles.authContainer}>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerButton} 
              onPress={() => router.replace('/register')}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentPage === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.dotContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131921',
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#a3a7b0',
    fontSize: 16,
    fontWeight: '600',
  },
  page: {
    width: width,
    height: height,
    justifyContent: 'flex-start',
  },
  innerPageContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 50,
    zIndex: 2,
  },
  bgImageStyle: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(19, 25, 33, 0.4)', 
  },
  imageContainer: {
    width: 140,
    height: 60,
    marginBottom: height * 0.18, 
    alignSelf: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'left',
    marginBottom: 14,
    lineHeight: 42,
  },
  highlight: {
    color: '#FFF', 
  },
  description: {
    fontSize: 14,
    color: '#a3a7b0',
    textAlign: 'left',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 5,
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: '#FFF',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#131921',
    fontSize: 16,
    fontWeight: 'bold',
  },
  authContainer: {
    width: '100%',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#131921',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
