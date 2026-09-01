import {StyleSheet} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {useNavigation} from "expo-router";
import {DrawerActions} from "expo-router/react-navigation";
import {Button} from "@/components/ui";

export default function HomeScreen() {
    const {logout, userProfile, user} = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <Button
                type="ghost"
                size="icon"
                icon={<Ionicons name="menu" size={24} color="white"/>}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
            <Button
                title="Logout"
                variant="danger"
                onPress={logout}
                style={styles.logoutBtn}
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
        gap: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutBtn: {
        minWidth: 120,
    },
});
