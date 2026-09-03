import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Button } from '@/components/ui';
import { DashedLine } from './DashedLine';

export interface RepairLocationQAProps {
    meetUpLocation: string;
    selectedCar: string;
    repairCategory: string;
    onPressLocation?: () => void;
    onPressVehicle?: () => void;
    onChooseOrAddVehicle?: () => void;
    onPressCategory?: () => void;
}

export function RepairLocationQA({
    meetUpLocation,
    selectedCar,
    repairCategory,
    onPressLocation,
    onPressVehicle,
    onChooseOrAddVehicle,
    onPressCategory,
}: RepairLocationQAProps) {
    return (
        <View style={styles.container}>
            {/* Section 1: Meet up point */}
            <View style={styles.qaSection}>
                <Text style={styles.qLabel}>Meet up point:</Text>
                <Button
                    type="link"
                    size="custom"
                    style={styles.linkButton}
                    onPress={onPressLocation}
                    activeOpacity={0.7}
                >
                    <Text style={styles.aValue} numberOfLines={2}>
                        {meetUpLocation}
                    </Text>
                    <DashedLine />
                </Button>
            </View>

            {/* Section 2: Which car do you want to fix */}
            <View style={styles.qaSection}>
                <Text style={styles.qLabel}>Which car do you want to fix:</Text>
                {/* Selected Car Link Button */}
                <Button
                    type="link"
                    size="custom"
                    style={styles.linkButton}
                    onPress={onPressVehicle}
                    activeOpacity={0.7}
                >
                    <View style={styles.carInfoRow}>
                        <MaterialDesignIcons name="car-side" size={16} color="#ffffff" />
                        <Text style={styles.carName}>{selectedCar}</Text>
                    </View>
                    <DashedLine />
                </Button>

                {/* Separate Choose or Add Vehicle Button */}
                <Button
                    type="link"
                    size="custom"
                    style={styles.chooseAddButton}
                    onPress={onChooseOrAddVehicle || onPressVehicle}
                    activeOpacity={0.7}
                >
                    <Text style={styles.chooseAddText}>Choose or add vehicle</Text>
                </Button>
            </View>

            {/* Section 3: Repair Category */}
            <View style={styles.qaSection}>
                <Text style={styles.qLabel}>Repair Category:</Text>
                <Button
                    type="link"
                    size="custom"
                    style={styles.linkButton}
                    onPress={onPressCategory}
                    activeOpacity={0.7}
                >
                    <Text style={styles.aValue} numberOfLines={2}>
                        {repairCategory}
                    </Text>
                    <DashedLine />
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        gap: 16,
        alignItems: 'flex-start',
    },
    qaSection: {
        gap: 4,
        width: '100%',
        alignItems: 'flex-start',
    },
    qLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0094ff',
        textAlign: 'left',
    },
    linkButton: {
        width: '100%',
        alignItems: 'flex-start',
        paddingVertical: 1,
    },
    aValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        lineHeight: 20,
        textAlign: 'left',
    },
    carInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-start',
    },
    carName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        textAlign: 'left',
    },
    chooseAddButton: {
        alignSelf: 'flex-start',
        paddingVertical: 2,
    },
    chooseAddText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: '500',
        textDecorationLine: 'underline',
        textAlign: 'left',
    },
});

export default RepairLocationQA;
