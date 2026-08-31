// app/Onboarding.tsx - FIXED
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Responsive sizes
const isTablet = width >= 768;

const SLIDES = [
  {
    id: "1",
    type: "car-intro",
    title: "Lets Get",
    subtitle: "started with us",
    desc: "Get started with using our service, design for convenient repair bookings. Get aquinted with tools created to enhance vehicle ownership pleasures and help safeguard your vehicle against unprofessional repairs.",
    useFullBg: true,
  },
  {
    id: "2",
    type: "text-intro",
    title: "Quality",
    subtitle: "number one",
    desc: "Quality repair assured with system tracking to facilitate easy repair monitoring for vehicle owners. Active customer support to help attend to your complaints in minutes.",
    useFullBg: false,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: any) => {
    setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const renderItem = ({ item }: { item: any }) => {
    const logoHeader = (
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logoImg}
          resizeMode="contain"
        />
      </View>
    );

    const dualButtons = () => (
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.whiteBtn}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.darkText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.borderBtn}
          onPress={() => router.push("/register")}
          activeOpacity={0.8}
        >
          <Text style={styles.whiteText}>Register</Text>
        </TouchableOpacity>
      </View>
    );

    const slideContent = () => (
      <View style={styles.content}>
        {logoHeader}
        <View style={styles.textBlock}>
          <Text style={styles.titleLarge}>
            {item.title}
            {"\n"}
            <Text style={styles.highlightText}>{item.subtitle}</Text>
          </Text>
          <Text style={styles.descText}>{item.desc}</Text>
        </View>
        {dualButtons()}
      </View>
    );

    if (item.useFullBg) {
      return (
        <ImageBackground
          source={require("../assets/login-bg.png")}
          style={styles.page}
          imageStyle={styles.bgImage}
        >
          <View style={styles.overlayLight} />
          {slideContent()}
        </ImageBackground>
      );
    }

    return <View style={[styles.page, { backgroundColor: "#131921" }]}>{slideContent()}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={width}
        decelerationRate="fast"
      />
      <View style={styles.dotRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentPage === i ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131921",
  },
  page: {
    width: width,
    height: height,
  },
  bgImage: {
    width: "100%",
    height: "50%",
    resizeMode: "cover",
  },
  overlayLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(19, 25, 33, 0.15)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 50,
    paddingBottom: 80,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoImg: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 60 : 50,
  },
  textBlock: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  titleLarge: {
    fontSize: isTablet ? 56 : 42,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "left",
    marginBottom: 16,
    lineHeight: isTablet ? 66 : 52,
  },
  highlightText: {
    color: "#4a9eff",
  },
  descText: {
    fontSize: isTablet ? 20 : 16,
    color: "#c8ccd6",
    textAlign: "left",
    lineHeight: isTablet ? 30 : 26,
    opacity: 0.9,
  },
  buttons: {
    width: "100%",
    maxWidth: isTablet ? 500 : "100%",
    alignSelf: "center",
    gap: 14,
  },
  whiteBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  darkText: {
    color: "#131921",
    fontSize: isTablet ? 20 : 17,
    fontWeight: "bold",
  },
  borderBtn: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    width: "100%",
    alignItems: "center",
  },
  whiteText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 20 : 17,
    fontWeight: "bold",
  },
  dotRow: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#4a9eff",
    width: 24,
  },
  inactiveDot: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});