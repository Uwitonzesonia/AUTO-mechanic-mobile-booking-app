import {Button, StyleSheet} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";

export default function GarageScreen() {
    const {logout, userProfile, user} = useAuth();
    return (
        <View style={styles.container}>
            <Text>Garage Screen</Text>
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
