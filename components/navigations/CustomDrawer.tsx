import { Drawer } from "expo-router/drawer";

export default function CustomDrawer() {
    return (
        <Drawer
        >
            <Drawer.Screen
                name="index"
                options={{
                    drawerLabel: 'Home',
                    title: 'overview',
                }}
            />
            <Drawer.Screen
                name="user/[id]"
                options={{
                    drawerLabel: 'User',
                    title: 'overview',
                }}
            />
        </Drawer>
    );
}
