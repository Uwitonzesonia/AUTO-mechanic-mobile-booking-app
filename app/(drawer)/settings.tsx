import {Button, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";
import {DrawerActions} from "expo-router/react-navigation";
import {useNavigation} from "expo-router";
import {Ionicons} from "@react-native-vector-icons/ionicons";

export default function SettingsScreen() {
    const {logout, userProfile, user} = useAuth();
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text>Settings Screen</Text>
            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
                <Ionicons name="menu" size={24} color="white"/>
            </TouchableOpacity>
            <Button
                title={"Logout"}
                onPress={logout}
            />
            {user && (
                <>
                    <Text>{userProfile?.fullName || userProfile?.email}</Text>
                    <Text>Role: {userProfile?.role?.toUpperCase()}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
