import React, {useEffect, useRef} from 'react';
import {View, Image, StyleSheet, Animated, Easing, Dimensions} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const {width, height} = Dimensions.get('window');
const CIRCLE_SIZE = 160;

const screenDiagonal = Math.sqrt(width * width + height * height);
const MAX_SCALE = (screenDiagonal / CIRCLE_SIZE) * 1.1;

export default function AnimatedSplashScreen({onFinish}: { onFinish: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        SplashScreen.hideAsync();

        Animated.timing(scale, {
            toValue: MAX_SCALE,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(() => onFinish());
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.circle,
                    {transform: [{scale}]},
                ]}
            />
            <Image
                source={require('../../assets/images/auto-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#0e0e10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        backgroundColor: '#2a2a2e',
        zIndex: 0,
    },
    logo: {
        width: 130,
        height: 40,
        zIndex: 1,
    },
});