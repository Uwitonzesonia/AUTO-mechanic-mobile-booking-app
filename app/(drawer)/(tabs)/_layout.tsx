import {Redirect, Tabs, useRouter} from 'expo-router';
import {useAuth} from "@/hooks/useAuth";
import React, {useState} from "react";
import {GarageIcon, HomeIcon, ProfileIcon, TabIconProps, WalletIcon, WrenchIcon} from "@/utils/tabsIcons";
import {Image, StyleSheet, Text, View} from "react-native";
import CustomHeader from "@/components/navigations/CustomHeader";
import {Button} from "@/components/ui";
import RepairLocationModal from "@/components/maintenance/RepairLocationModal";

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

export function CustomTabBar(
    {
        state,
        navigation,
        onOpenRepairModal,
    }: BottomTabBarProps & { onOpenRepairModal: () => void }) {

    const currentRoute = state.routes[state.index];

    if (currentRoute.name === "maintenance") {
        return null;
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.bar}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const isCenter = route.name === "maintenance" || route.name === "Tools";
                    const Icon = ICONS[route.name] || HomeIcon;

                    const onPress = () => {
                        if (isCenter) {
                            onOpenRepairModal();
                            return;
                        }

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
                        return (
                            <Button
                                key={route.key}
                                type="custom"
                                size="custom"
                                onPress={onPress}
                                style={styles.centerButton}
                                activeOpacity={0.85}
                            >
                                <Icon
                                    focused={isFocused}
                                    color={isFocused ? "#ffffff" : "#999999"}
                                    size={24}
                                />
                            </Button>
                        );
                    }

                    return (
                        <Button
                            key={route.key}
                            type="custom"
                            size="custom"
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Icon
                                focused={isFocused}
                                color={isFocused ? "#ffffff" : "#666666"}
                                size={22}
                            />
                        </Button>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabLayout() {
    const {isAuthenticated, isLoading, userProfile, user} = useAuth();
    const router = useRouter();
    const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);

    if (isLoading) return null;
    if (!isAuthenticated) return <Redirect href="/(auth)/login"/>;

    const avatarUri = user?.photoURL;
    const displayName = userProfile?.fullName || userProfile?.username || user?.displayName || "User";
    const initial = (displayName[0] || "U").toUpperCase();

    return (
        <>
            <Tabs
                tabBar={(props) => (
                    <CustomTabBar
                        {...props}
                        onOpenRepairModal={() => setIsRepairModalOpen(true)}
                    />
                )}
                screenOptions={{
                    header: (props) =>
                        <CustomHeader
                            title={props?.options?.title || props?.route?.name || "Home"}
                            rightAction={
                                <Button
                                    type="custom"
                                    size="custom"
                                    onPress={() => props.navigation.navigate("profile")}
                                    style={styles.profileHeaderButton}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.avatarContainer}>
                                        {avatarUri ? (
                                            <Image
                                                source={{uri: avatarUri}}
                                                style={styles.avatarImage}
                                            />
                                        ) : (
                                            <View style={styles.avatarFallback}>
                                                <Text style={styles.avatarInitial}>{initial}</Text>
                                            </View>
                                        )}
                                        <View style={styles.activeDot}/>
                                    </View>
                                    <Text style={styles.profileHeaderName} numberOfLines={2}>
                                        {displayName}
                                    </Text>
                                </Button>
                            }
                        />
                }}
            >
                <Tabs.Screen name="index" options={{title: "Home"}}/>
                <Tabs.Screen name="garage" options={{title: "Garage"}}/>
                <Tabs.Screen
                    name="maintenance"
                    options={{title: "Maintenance"}}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setIsRepairModalOpen(true);
                        }
                    }}
                />
                <Tabs.Screen name="wallet" options={{title: "Wallet"}}/>
                <Tabs.Screen name="profile" options={{title: "Profile"}}/>
            </Tabs>
            <RepairLocationModal
                visible={isRepairModalOpen}
                onClose={() => setIsRepairModalOpen(false)}
                onStartSearch={(data) => {
                    setIsRepairModalOpen(false);
                    router.navigate({
                        pathname: '/(drawer)/(tabs)/maintenance',
                        params: {
                            searchTrigger: String(Date.now()),
                            car: data?.selectedCar,
                            location: data?.meetUpLocation,
                            category: data?.repairCategory,
                        },
                    });
                }}
            />
        </>
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
        shadowOffset: {width: 0, height: 4},
        shadowRadius: 8,
        elevation: 6,
    },
    profileHeaderButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        alignSelf: "flex-end",
        gap: 8,
        paddingVertical: 2,
        paddingHorizontal: 0,
    },
    avatarContainer: {
        position: "relative",
        width: 32,
        height: 32,
    },
    avatarImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#202730",
    },
    avatarFallback: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FF5924",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarInitial: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
    },
    activeDot: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: "#22C55E",
        borderWidth: 1.5,
        borderColor: "#000000",
    },
    profileHeaderName: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "500",
        maxWidth: 80,
        lineHeight: 16,
        textAlign: "left",
    },
});
