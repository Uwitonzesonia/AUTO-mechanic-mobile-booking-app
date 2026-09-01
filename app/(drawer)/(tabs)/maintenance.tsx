import {StyleSheet} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui";

export default function MaintenanceScreen() {
    const {logout, userProfile, user} = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Maintenance Screen</Text>
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
