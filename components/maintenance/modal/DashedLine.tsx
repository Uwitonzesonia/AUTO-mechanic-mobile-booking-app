import React, { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

export interface DashedLineProps {
    color?: string;
    strokeWidth?: number;
    dashLength?: number;
    dashGap?: number;
    style?: StyleProp<ViewStyle>;
}

export function DashedLine({
    color = 'rgba(255, 255, 255, 0.3)',
    strokeWidth = 1.2,
    dashLength = 6,
    dashGap = 4,
    style,
}: DashedLineProps) {
    const [width, setWidth] = useState(0);

    return (
        <View
            style={[styles.container, style]}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
            {width > 0 && (
                <Svg height={strokeWidth * 2} width={width}>
                    <Line
                        x1="0"
                        y1={strokeWidth}
                        x2={width}
                        y2={strokeWidth}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${dashLength}, ${dashGap}`}
                    />
                </Svg>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 6,
        marginBottom: 2,
    },
});

export default DashedLine;
