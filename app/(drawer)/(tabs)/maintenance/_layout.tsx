import {Stack} from "expo-router"

export default function MaintenanceLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="booking" options={{headerShown: false}}/>
        </Stack>
    );
}
