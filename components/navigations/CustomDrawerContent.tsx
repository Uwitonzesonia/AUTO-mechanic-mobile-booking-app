import React from "react";
import {View, Text, TouchableOpacity, StyleSheet, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {DrawerContentScrollView} from "expo-router/drawer";
import {useAuth} from "@/hooks/useAuth";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import AntDesign from "@react-native-vector-icons/ant-design";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {Ionicons} from "@react-native-vector-icons/ionicons";

const DrawerItems = [
    {
        title: "Messages",
        screen: "messages",
        icon: (color: string) => (
            <MaterialDesignIcons name="message-reply-text-outline" size={22} color={color}/>
        ),
    },
    {
        title: "Settings",
        screen: "settings",
        icon: (color: string) => (
            <Ionicons name="settings-outline" size={22} color={color}/>
        ),
    },
    {
        title: "Support",
        screen: "support",
        icon: (color: string) => (
            <MaterialDesignIcons name="headset" size={22} color={color}/>
        ),
    },
    {
        title: "T & C",
        screen: "termsConditions",
        icon: (color: string) => (
            <MaterialDesignIcons name="clipboard-text-multiple-outline" size={22} color={color}/>
        ),
    },
];

export default function CustomDrawerContent(props: any) {
    const {logout} = useAuth();
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={["#202730", "#15191d"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={styles.gradientContainer}
        >
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Close Button in Top Corner & Logo centered under it */}
                <View style={styles.header}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => props.navigation.closeDrawer()}
                            activeOpacity={0.7}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <AntDesign name="close" size={22} color="#fff"/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("@/assets/images/auto-logo.png")}
                            style={styles.logo}
                        />
                    </View>
                </View>

                {/* Navigation Items */}
                <View style={styles.menuItems}>
                    {DrawerItems.map((item, index) => {
                        const isActive = props.state.routes[props.state.index]?.name === item.screen;
                        const iconColor = isActive ? "#FFFFFF" : "#a6b1bd";

                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.menuItem, isActive && styles.menuItemActive]}
                                onPress={() => props.navigation.navigate(item.screen)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.iconContainer}>{item.icon(iconColor)}</View>
                                <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                                    {item.title.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </DrawerContentScrollView>

            {/* Footer with Logout pinned to bottom without visible dividers */}
            <View style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                    activeOpacity={0.7}
                >
                    <AntDesign
                        name="logout"
                        size={20}
                        color="#FF4D4F"
                        style={styles.logoutIcon}
                    />
                    <Text style={styles.logoutText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        justifyContent: "space-between",
    },
    scrollContent: {
        paddingTop: 8,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 16,
    },
    closeButtonContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 8,
    },
    closeButton: {
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
    },
    logo: {
        width: 100,
        height: 36,
        resizeMode: "contain",
    },
    menuItems: {
        paddingHorizontal: 14,
        paddingTop: 8,
        gap: 14,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: 10,
    },
    menuItemActive: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        paddingHorizontal: 5,
    },
    iconContainer: {
        width: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    menuItemText: {
        marginLeft: 14,
        color: "#a6b1bd",
        fontSize: 13,
        fontWeight: "500",
        letterSpacing: 1.5,
        flex: 1,
    },
    menuItemTextActive: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    footer: {
        paddingHorizontal: 30,
        paddingTop: 16,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    logoutIcon: {
        transform: [{rotate: "-90deg"}],
    },
    logoutText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "300",
        letterSpacing: 1.5,
    },
});
