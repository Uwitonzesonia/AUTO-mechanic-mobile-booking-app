import {ScrollView, StyleSheet} from 'react-native';
import {Text} from '@/components/Themed';
import React, {useEffect, useLayoutEffect} from "react";
import {useLocalSearchParams, useNavigation} from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import Mechanics from "@/constants/mechanics";
import {Avatar, Button} from "@/components/ui";

export default function BookingScreen() {
    const navigation = useNavigation();
    const mechanicId = useLocalSearchParams<{ mechanicId: string }>()
    const [mechanic, setMechanic] = React.useState<typeof Mechanics[0] | undefined>(undefined);

    useEffect(() => {
        const fetchMechanicDetails = () => {
            setMechanic(Mechanics.find(m => m.id === mechanicId.mechanicId))
        }
        fetchMechanicDetails();
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: () => (
                <CustomHeader
                    title={"Booking info"}
                    showBackButton={true}
                    headerInMiddle={true}
                />
            ),
        });
    }, [navigation]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Avatar imageUrl={mechanic?.profileImage} style={{borderColor: "white", borderWidth: 2}}/>
            <Text style={styles.title}>{mechanic?.names}</Text>
            <Text style={styles.title}>+{mechanic?.telephone}</Text>
            <Text>Years of experience: +{mechanic?.years_experience}</Text>
            <Text>{mechanic?.expertise?.map((car, index) => <Text key={index}>{car}, </Text>)}</Text>
            <Text>Flat Fee: {'\u20AC'}{mechanic?.flat_fee}</Text>
            <Text>Consultation Fee{'\u20AC'}{mechanic?.consultation_fee}</Text>
            <Text>Total: {'\u20AC'}{Number(mechanic?.consultation_fee) + Number(mechanic?.flat_fee)}</Text>
            <Text style={{textAlign: "center"}}>
                Note: Booking fee is the charge for booking a fix. Additional fees would be
                added after autohelp’s inspection
            </Text>
            <Text style={{textAlign: "center"}}>
            Note: Booking fee is the charge for booking a fix. Additional fees would be
            added after autohelp’s inspection
        </Text>

            <Button
                title="Book a fix"
                variant="danger"
                onPress={() => {
                }}
                style={styles.logoutBtn}
            />
        </ScrollView>
    )
        ;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f151d",
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutBtn: {
        borderRadius: 50,
        minWidth: 140,
    },
});
