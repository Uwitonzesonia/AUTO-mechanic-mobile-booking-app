import React from 'react';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { Button } from '@/components/ui';

export interface ParallelogramButtonProps {
    title?: string;
    children?: React.ReactNode;
    onPress?: () => void;
    height?: number;
    width?: number | `${number}%`;
    baseColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

export function ParallelogramButton({
    title,
    children,
    onPress,
    height = 30,
    width = '90%',
    baseColor = '#0094ff',
    strokeColor = 'rgba(255, 255, 255, 0.45)',
    strokeWidth = 1.2,
    style,
    textStyle,
    disabled = false,
}: ParallelogramButtonProps) {
    return (
        <Button
            type="custom"
            size="custom"
            style={[styles.buttonContainer, { height, width }, style]}
            onPress={onPress}
            activeOpacity={0.85}
            disabled={disabled}
        >
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 295 28"
                preserveAspectRatio="none"
                style={StyleSheet.absoluteFill}
            >
                <Defs>
                    <LinearGradient id="btn303030Grad" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0%" stopColor="#050505" stopOpacity="0.70" />
                        <Stop offset="45%" stopColor="#303030" stopOpacity="0.40" />
                        <Stop offset="100%" stopColor="#303030" stopOpacity="0.05" />
                    </LinearGradient>
                </Defs>
                {/* Base Layer */}
                <Path
                    d="M20.9482 0H294.322L273.374 27.2327H0L20.9482 0Z"
                    fill={baseColor}
                />
                {/* 40% Dark-to-Light Gradient Overlay + Border */}
                <Path
                    d="M20.9482 0H294.322L273.374 27.2327H0L20.9482 0Z"
                    fill="url(#btn303030Grad)"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
            </Svg>

            {children ? (
                children
            ) : (
                <Text style={[styles.buttonText, textStyle]}>{title}</Text>
            )}
        </Button>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: 1.5,
    },
});

export default ParallelogramButton;
