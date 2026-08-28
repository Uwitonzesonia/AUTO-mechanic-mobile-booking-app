import {Button, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {useNavigation} from "expo-router";
import {DrawerActions} from "expo-router/react-navigation";

export default function HomeScreen() {
    const {logout, userProfile, user} = useAuth();
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
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
