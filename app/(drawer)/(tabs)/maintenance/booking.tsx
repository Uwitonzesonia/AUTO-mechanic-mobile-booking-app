import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useLocalSearchParams, useNavigation} from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import Mechanics from "@/constants/mechanics";
import {Avatar, Button} from "@/components/ui";
import {Ionicons} from '@react-native-vector-icons/ionicons';

const PAYMENT_METHODS = [
    {id: 'cash', title: 'Cash', icon: 'cash-outline', color: '#22c55e'},
    {id: 'momo', title: 'Mobile Money (MoMo)', icon: 'phone-portrait-outline', color: '#eab308'},
    {id: 'bank', title: 'Bank Transfer', icon: 'card-outline', color: '#0094ff'},
] as const;

export default function BookingScreen() {
    const navigation = useNavigation();
    const mechanicId = useLocalSearchParams<{ mechanicId: string }>()
    const [mechanic, setMechanic] = React.useState<typeof Mechanics[0] | undefined>(undefined);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}>
            <Avatar imageUrl={mechanic?.profileImage} style={{borderColor: "white", borderWidth: 2}}/>

            <Text style={[styles.title, styles.text]}>{mechanic?.names}</Text>
            <Text style={styles.text}>+{mechanic?.telephone}</Text>

            <View style={{flexDirection: "column", gap: 8, width: "90%", marginVertical: 30}}>
                <View style={styles.row}>
                    <Text style={styles.text}>Car expertise</Text>
                    <Text style={styles.text}>{mechanic?.expertise?.map((car, index) => <Text
                        key={index}>{car}, </Text>)}
                    </Text>
                </View><View style={styles.row}>
                <Text style={styles.text}>Location:</Text>
                <Text style={styles.text}>{mechanic?.location_name}</Text>
            </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Flat Fee:</Text>
                    <Text style={[styles.text, styles.title]}> {'\u20AC'}{mechanic?.flat_fee}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Consultation Fee:</Text>
                    <Text style={[styles.text, styles.title]}>{'\u20AC'}{mechanic?.consultation_fee}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.text}>Total:</Text>
                    <Text
                        style={[styles.text, styles.title]}>{'\u20AC'}{Number(mechanic?.consultation_fee) + Number(mechanic?.flat_fee)}</Text>
                </View>
            </View>

            <Text style={[styles.text, {textAlign: "center"}]}>
                Note: Booking fee is the charge for booking a fix. Additional fees would be
                added after autohelp’s inspection
            </Text>
            {/* Custom Payment Dropdown */}
            <View style={styles.dropdownWrapper}>
                <Pressable
                    style={[
                        styles.dropdownTrigger,
                        isDropdownOpen && styles.dropdownTriggerOpen,
                    ]}
                    onPress={() => setIsDropdownOpen((prev) => !prev)}
                >
                    <View style={styles.dropdownLeft}>
                        {selectedPayment ? (
                            <>
                                <View style={[styles.iconBadge, {backgroundColor: `${selectedPayment.color}20`}]}>
                                    <Ionicons
                                        name={selectedPayment.icon}
                                        size={18}
                                        color={selectedPayment.color}
                                    />
                                </View>
                                <Text style={[styles.dropdownSelectedText, styles.text]}>
                                    {selectedPayment.title}
                                </Text>
                            </>
                        ) : (
                            <Text style={[styles.dropdownPlaceholder, styles.text]}>
                                Select Payment Method
                            </Text>
                        )}
                    </View>
                    <Ionicons
                        name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#9ba8b8"
                    />
                </Pressable>

                {isDropdownOpen && (
                    <View style={styles.dropdownMenu}>
                        {PAYMENT_METHODS.map((method, index) => {
                            const isSelected = paymentMethod === method.id;
                            const isLast = index === PAYMENT_METHODS.length - 1;

                            return (
                                <Pressable
                                    key={method.id}
                                    style={[
                                        styles.dropdownItem,
                                        isSelected && styles.dropdownItemSelected,
                                        !isLast && styles.dropdownItemDivider,
                                    ]}
                                    onPress={() => {
                                        setPaymentMethod(method.id);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <View style={styles.dropdownLeft}>
                                        <View
                                            style={[
                                                styles.iconBadge,
                                                {backgroundColor: `${method.color}20`},
                                            ]}
                                        >
                                            <Ionicons
                                                name={method.icon}
                                                size={18}
                                                color={method.color}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.itemText,
                                                isSelected && styles.itemTextSelected,
                                                styles.text,
                                            ]}
                                        >
                                            {method.title}
                                        </Text>
                                    </View>

                                    {isSelected && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color="#0094ff"
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            </View>

            <Button
                title="Book a fix"
                variant="danger"
                onPress={() => {
                }}
                style={styles.logoutBtn}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f151d",
    },
    text: {color: 'white'},
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        paddingBottom: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: "row"
    },
    logoutBtn: {
        borderRadius: 50,
        minWidth: 140,
    },
    dropdownWrapper: {
        width: '90%',
        marginVertical: 8,
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: '#161e28',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dropdownTriggerOpen: {
        // borderColor: '#0094ff',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    dropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dropdownSelectedText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    dropdownPlaceholder: {
        // color: '#8292a4',
        fontSize: 15,
    },
    dropdownMenu: {
        // backgroundColor: '#131b24',
        borderWidth: 1.5,
        borderTopWidth: 0,
        // borderColor: '#0094ff',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dropdownItemSelected: {
        backgroundColor: 'rgba(0, 148, 255, 0.12)',
    },
    dropdownItemDivider: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    },
    iconBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        color: '#9ba8b8',
        fontSize: 15,
        fontWeight: '500',
    },
    itemTextSelected: {
        color: '#ffffff',
        fontWeight: '600',
    },
});
