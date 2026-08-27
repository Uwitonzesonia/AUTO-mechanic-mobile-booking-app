// app/Onboarding.tsx
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
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { 
    id: '1', 
    title: 'Lets Get', 
    subtitle: 'started with us',
    desc: 'Get started with using our service, design for convenience, repair bookings. Get acquired with tools created to enhance vehicle experience and help safeguard your vehicle against unprofessional repairs.',
    bg: '#1a2332' 
  },
  { 
    id: '2', 
    title: 'Quality number one', 
    subtitle: '',
    desc: 'Quality repair, assessment and training to guarantee easy repair, testing for vehicle owners. Active customer support to help customers in your comfort & lives.',
    bg: '#1a2332' 
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handlePageSelect = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const handleNext = () => {
    if (currentPage < SLIDES.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      // Navigate to login when done
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    // Skip to login
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <PagerView 
        style={styles.pagerView} 
        initialPage={0}
        ref={pagerRef}
        onPageSelected={handlePageSelect}
      >
        {SLIDES.map((item) => (
          <View style={[styles.page, { backgroundColor: item.bg }]} key={item.id}>
            {/* Logo */}
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
        ))}
      </PagerView>

      {/* Bottom: Dots + Button */}
      <View style={styles.footer}>
        <View style={styles.dotContainer}>
          {SLIDES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentPage === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentPage === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#161b22',
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
  pagerView: { 
    flex: 1,
  },
  page: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40,
    paddingTop: 60,
  },
  imageContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: { 
    fontSize: 38, 
    fontWeight: 'bold', 
    color: '#FFF', 
    textAlign: 'center', 
    marginBottom: 16,
    lineHeight: 46,
  },
  highlight: {
    color: '#4a9eff',
  },
  description: { 
    fontSize: 15, 
    color: '#c8ccd6', 
    textAlign: 'center', 
    lineHeight: 24,
    opacity: 0.9,
  },
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    left: 0, 
    right: 0, 
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dotContainer: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  dot: { 
    height: 8, 
    borderRadius: 4, 
    marginHorizontal: 5,
  },
  activeDot: { 
    width: 24, 
    backgroundColor: '#4a9eff',
  },
  inactiveDot: { 
    width: 8, 
    backgroundColor: 'rgba(255, 255, 255, 0.3)' 
  },
  button: { 
    backgroundColor: '#4a9eff', 
    paddingVertical: 16, 
    paddingHorizontal: 60, 
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});