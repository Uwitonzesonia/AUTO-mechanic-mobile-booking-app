import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import {
    HomeIcon,
    GarageIcon,
    WrenchIcon,
    WalletIcon,
    ProfileIcon,
    TabIconProps,
} from "@/utils/tabsIcons";

export type BottomTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>>[0];

const ICONS: Record<string, React.FC<TabIconProps>> = {
    index: HomeIcon,
    Home: HomeIcon,
    garage: GarageIcon,
    Garage: GarageIcon,
    maintenance: WrenchIcon,
    Tools: WrenchIcon,
    wallet: WalletIcon,
    Wallet: WalletIcon,
    profile: ProfileIcon,
    Profile: ProfileIcon,
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.bar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const isCenter = route.name === "maintenance" || route.name === "Tools";
                    const Icon = ICONS[route.name] || HomeIcon;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    if (isCenter) {
                        // The raised, filled circular button — rendered outside the flat row
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={styles.centerButton}
                                activeOpacity={0.85}
                            >
                                <Icon
                                    focused={isFocused}
                                    color={isFocused ? "#ffffff" : "#999999"}
                                    size={24}
                                />
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Icon
                                focused={isFocused}
                                color={isFocused ? "#ffffff" : "#666666"}
                                size={22}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

export default function CustomTabs() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="garage" />
            <Tabs.Screen name="maintenance" />
            <Tabs.Screen name="wallet" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: "center",
    },
    bar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#151517",
        borderRadius: 40,
        height: 68,
        paddingHorizontal: 12,
        width: "100%",
    },
    tabItem: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#000000",
        borderWidth: 1.5,
        borderColor: "#262626",
        alignItems: "center",
        justifyContent: "center",
        marginTop: -28,
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 6,
    },
});