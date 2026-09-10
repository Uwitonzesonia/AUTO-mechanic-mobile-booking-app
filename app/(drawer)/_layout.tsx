import {Drawer} from "expo-router/drawer";
import CustomDrawerContent from "@/components/navigations/CustomDrawerContent";

export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: "front",
                drawerStyle: {
                    backgroundColor: "#151517",
                    width: "65%",
                },
                drawerActiveTintColor: "white",
                drawerInactiveTintColor: "white",
                drawerLabelStyle: {
                    letterSpacing: 1.5,
                },
            }}
        >
            {/* The Tabs screen - hides its own drawer item if you customize it */}
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: "HOME",
                    title: "Home",
                }}
            />
            <Drawer.Screen
                name="messages"
                options={{
                    drawerLabel: "MESSAGES",
                    title: "Messages",
                }}
            />
            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: "SETTINGS",
                    title: "Settings",
                }}
            />
            <Drawer.Screen
                name="support"
                options={{
                    drawerLabel: "SUPPORT",
                    title: "Support",
                }}
            />
            <Drawer.Screen
                name="termsConditions"
                options={{
                    drawerLabel: "T & C",
                    title: "T & C",
                }}
            />
        </Drawer>
    );
}
