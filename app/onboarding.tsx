import React, {useRef, useState} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import PagerView, {PagerViewOnPageSelectedEvent} from "react-native-pager-view";
import {useRouter} from "expo-router";
import {SLIDES} from "@/constants/GetStarted";
import {Button} from "@/components/ui";
import {secureStorageEngine} from "@/utils/secureStore";

const {width} = Dimensions.get("window");
const isTablet = width >= 768;

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef<PagerView>(null);

    const markOpenedFirstTime = async () => {
        try {
            await secureStorageEngine.setItem("openFirstTime", "true");
        } catch (e) {
            console.error("Error saving openFirstTime:", e);
        }
    };

    const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
        setCurrentPage(e.nativeEvent.position);
        markOpenedFirstTime();
    };

    const handleLogin = async () => {
        await markOpenedFirstTime();
        router.push("/(auth)/login");
    };

    const handleRegister = async () => {
        await markOpenedFirstTime();
        router.push("/(auth)/register");
    };

    const handleDotPress = (index: number) => {
        pagerRef.current?.setPage(index);
    };

    return (
        <View style={styles.container}>
            <PagerView
                style={styles.pagerView}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={handlePageSelected}
            >
                {SLIDES.map((item) => {
                    const isCarIntro = item.type === "car-intro";

                    return (
                        <View key={item.id} style={styles.page}>
                            <ScrollView
                                contentContainerStyle={styles.scrollContent}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                {/* Half-screen image background inside ScrollView for car-intro */}
                                {isCarIntro && (
                                    <View style={styles.halfBgContainer} pointerEvents="none">
                                        <Image
                                            source={require("../assets/login-bg.png")}
                                            style={styles.halfBgImage}
                                            resizeMode="cover"
                                        />
                                        <LinearGradient
                                            colors={[
                                                "rgba(15, 21, 29, 0.25)",
                                                "rgba(15, 21, 29, 0.65)",
                                                "#0f151d",
                                            ]}
                                            style={styles.halfBgGradient}
                                        />
                                    </View>
                                )}

                                {/* Logo in the same view */}
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require("../assets/images/auto-logo.png")}
                                        style={styles.logoImg}
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Content */}
                                <View style={styles.textBlock}>
                                    <Text style={styles.titleLarge}>{item.title}</Text>
                                    <Text style={styles.descText}>{item.desc}</Text>
                                </View>

                                <View style={styles.bottomSection}>
                                    <View style={styles.dotRow}>
                                        {SLIDES.map((slide, index) => (
                                            <Button
                                                key={slide.id || index}
                                                type="custom"
                                                size="custom"
                                                onPress={() => handleDotPress(index)}
                                                accessibilityLabel={`Go to slide ${index + 1}`}
                                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                style={[
                                                    styles.dot,
                                                    currentPage === index
                                                        ? styles.activeDot
                                                        : styles.inactiveDot,
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    <View style={styles.buttonContainer}>
                                        <Button
                                            title="Login"
                                            size="lg"
                                            fullWidth
                                            onPress={handleLogin}
                                            style={styles.whiteBtn}
                                            textStyle={styles.darkText}
                                        />
                                        <Button
                                            title="Register"
                                            variant="outline"
                                            size="lg"
                                            fullWidth
                                            onPress={handleRegister}
                                            style={styles.borderBtn}
                                            textStyle={styles.whiteText}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    );
                })}
            </PagerView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    pagerView: {
        flex: 1,
    },
    page: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "space-between",
        paddingHorizontal: isTablet ? 48 : 32,
        paddingTop: isTablet ? 40 : 24,
        paddingBottom: isTablet ? 48 : 36,
        maxWidth: isTablet ? 540 : "100%",
        width: "100%",
        alignSelf: "center",
        position: "relative",
    },
    halfBgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: isTablet ? 420 : 320,
        overflow: "hidden",
    },
    halfBgImage: {
        width: "100%",
        height: "100%",
    },
    halfBgGradient: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 60,
    },
    logoImg: {
        width: isTablet ? 130 : 100,
        height: isTablet ? 50 : 34,
    },
    textBlock: {
        alignItems: "flex-start",
        marginVertical: 20,
    },
    titleLarge: {
        fontSize: isTablet ? 48 : 33,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "left",
        marginBottom: 16,
        lineHeight: isTablet ? 60 : 46,
    },
    descText: {
        minHeight: 150,
        fontSize: isTablet ? 16 : 14,
        color: "#c8ccd6",
        textAlign: "left",
        lineHeight: isTablet ? 28 : 24,
        opacity: 0.9,
    },
    bottomSection: {
        width: "100%",
        marginTop: 20,
    },
    dotRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    activeDot: {
        width: 28,
        backgroundColor: "#FFFFFF",
    },
    inactiveDot: {
        width: 8,
        backgroundColor: "rgba(255, 255, 255, 0.55)",
    },
    buttonContainer: {
        width: "100%",
        gap: 14,
    },
    whiteBtn: {
        backgroundColor: "#FFFFFF",
        borderColor: "transparent",
        borderRadius: 28,
    },
    darkText: {
        color: "#131921",
        fontWeight: "bold",
        fontSize: isTablet ? 18 : 16,
    },
    borderBtn: {
        backgroundColor: "transparent",
        borderColor: "#FFFFFF",
        borderWidth: 1.5,
        borderRadius: 28,
    },
    whiteText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: isTablet ? 18 : 16,
    },
});