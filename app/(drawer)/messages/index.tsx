import {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from '@/components/Themed';
import {useAuth} from "@/hooks/useAuth";
import {Button} from "@/components/ui";
import {getApp} from '@react-native-firebase/app';
import {getMessaging, getToken, onMessage, RemoteMessage} from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

export default function MessagesScreen() {
    const {logout, userProfile, user} = useAuth();
    const [fcmToken, setFcmToken] = useState<String | null>(null);
    const [lastMessage, setLastMessage] = useState<RemoteMessage | null>(null);

    useEffect(() => {
        const messagingInstance = getMessaging(getApp());

        const setupMessaging = async () => {
            const {status} = await Notifications.requestPermissionsAsync();

            if (status === 'granted') {
                const token = await getToken(messagingInstance);
                setFcmToken(token);
            }
        };

        setupMessaging();

        return onMessage(messagingInstance, async remoteMessage => {
            setLastMessage(remoteMessage);
        });
    }, []);

    // @ts-ignore
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages Screen</Text>
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
            <View style={styles.tokenBox}>
                <Text style={styles.tokenLabel}>FCM Token</Text>
                <Text style={styles.tokenValue} numberOfLines={3}>
                    {fcmToken || 'Fetching...'}
                </Text>
                <Button
                    title="Copy Token"
                    variant="secondary"
                    onPress={() => console.log(fcmToken)}
                    style={styles.copyBtn}
                />
            </View>
            {lastMessage && (
                <View style={styles.tokenBox}>
                    <Text style={styles.tokenLabel}>Last Message Received</Text>
                    <Text>{lastMessage.notification?.title}</Text>
                    <Text>{lastMessage.notification?.body}</Text>
                </View>
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
    tokenBox: {
        width: '85%',
        padding: 12,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 6,
    },
    tokenLabel: {
        fontWeight: '600',
    },
    tokenValue: {
        fontSize: 12,
    },
    copyBtn: {
        marginTop: 4,
    },
});