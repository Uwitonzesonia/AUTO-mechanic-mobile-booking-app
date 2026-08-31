import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import {useNavigation, useRouter} from "expo-router";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {DrawerActions} from "expo-router/react-navigation";

export interface CustomHeaderProps {
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    headerInMiddle?: boolean;
    centerTitle?: boolean;
    showBackButton?: boolean;
    showMenuButton?: boolean;
    onBackPress?: () => void;
    onMenuPress?: () => void;
    hideLeft?: boolean;
    hideRight?: boolean;
    style?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
    backgroundColor?: string;
    tintColor?: string;
}

export default function CustomHeader(
    {
        title,
        subtitle,
        leftAction,
        rightAction,
        headerInMiddle,
        centerTitle,
        showBackButton = false,
        showMenuButton = true,
        onBackPress,
        onMenuPress,
        hideLeft = false,
        hideRight = false,
        style,
        titleStyle,
        subtitleStyle,
        backgroundColor = "#202730",
        tintColor = "#ffffff",
    }: CustomHeaderProps) {
    const navigation = useNavigation();
    const router = useRouter();

    const isCentered = headerInMiddle ?? centerTitle ?? false;

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else if (router.canGoBack()) {
            router.back();
        } else {
            navigation.goBack();
        }
    };

    const handleMenuPress = () => {
        if (onMenuPress) {
            onMenuPress();
        } else {
            navigation.dispatch(DrawerActions.openDrawer());
        }
    };

    const renderLeft = () => {
        if (hideLeft) return null;
        if (leftAction !== undefined) return leftAction;

        if (showBackButton) {
            return (
                <TouchableOpacity
                    onPress={handleBackPress}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={20} color={tintColor}/>
                </TouchableOpacity>
            );
        }

        if (showMenuButton) {
            return (
                <TouchableOpacity
                    onPress={handleMenuPress}
                    style={styles.iconButton}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Open navigation menu"
                >
                    <Ionicons name="menu" size={20} color={tintColor}/>
                </TouchableOpacity>
            );
        }

        return null;
    };

    const renderTitle = (centered: boolean) => {
        return (
            <View style={centered ? styles.titleCenterWrapper : styles.titleLeftWrapper}>
                {typeof title === "string" ? (
                    <Text
                        style={[styles.title, {color: tintColor}, titleStyle]}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                ) : (
                    title
                )}

                {subtitle ? (
                    typeof subtitle === "string" ? (
                        <Text
                            style={[styles.subtitle, subtitleStyle]}
                            numberOfLines={1}
                        >
                            {subtitle}
                        </Text>
                    ) : (
                        subtitle
                    )
                ) : null}
            </View>
        );
    };

    const renderRight = () => {
        if (hideRight) return null;
        if (rightAction !== undefined) return rightAction;
        return <View style={styles.placeholder}/>;
    };

    const dynamicContainerStyle = [
        styles.headerContainer,
        backgroundColor ? {backgroundColor} : null,
        style,
    ];

    if (isCentered) {
        return (
            <View style={dynamicContainerStyle}>
                <View style={styles.sideLeftContainer}>
                    {renderLeft()}
                </View>

                <View style={styles.centerContainer}>
                    {renderTitle(true)}
                </View>

                <View style={styles.sideRightContainer}>
                    {renderRight()}
                </View>
            </View>
        );
    }

    return (
        <View style={dynamicContainerStyle}>
            <View style={styles.leftContainer}>
                {renderLeft()}
                {renderTitle(false)}
            </View>

            <View style={styles.rightContainer}>
                {renderRight()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 16,
        paddingRight: 12,
        backgroundColor: "#000000",
    },
    leftContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sideLeftContainer: {
        minWidth: 40,
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    sideRightContainer: {
        minWidth: 40,
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1,
    },
    titleLeftWrapper: {
        flex: 1,
        justifyContent: "center",
    },
    titleCenterWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconButton: {
        padding: 6,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.65)",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 1,
    },
    rightContainer: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        marginLeft: 12,
    },
    placeholder: {
        width: 26,
    },
});
