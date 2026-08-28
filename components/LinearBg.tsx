import {LinearGradient} from "expo-linear-gradient";
import {ReactNode} from "react";
import {StyleSheet, ViewStyle, StyleProp} from "react-native";

interface LinearBgViewProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const LinearBgView = ({children, style}: LinearBgViewProps) => {

    return (
        <LinearGradient
            colors={["#202730", "#15191d"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.gradientContainer, style]}
        >
            {children}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
})