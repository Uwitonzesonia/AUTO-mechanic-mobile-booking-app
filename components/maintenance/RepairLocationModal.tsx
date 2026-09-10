import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Button } from '@/components/ui';
import { getCurrentUserLocation } from '@/utils/location';
import { RepairLocationTimeline } from './modal/RepairLocationTimeline';
import { RepairLocationQA } from './modal/RepairLocationQA';
import { ParallelogramButton } from './ParallelogramButton';

export interface RepairLocationData {
    meetUpLocation?: string;
    selectedCar?: string;
    repairCategory?: string;
}

export interface RepairLocationModalProps {
    visible: boolean;
    onClose: () => void;
    onStartSearch?: (data?: RepairLocationData) => void;
    onPressLocation?: () => void;
    onPressVehicle?: () => void;
    onChooseOrAddVehicle?: () => void;
    onPressCategory?: () => void;
}

export function RepairLocationModal({
    visible,
    onClose,
    onStartSearch,
    onPressLocation,
    onPressVehicle,
    onChooseOrAddVehicle,
    onPressCategory,
}: RepairLocationModalProps) {
    const [meetUpLocation, setMeetUpLocation] = useState('Chancellor Place, Platt Halls');
    const [selectedCar, setSelectedCar] = useState('Toyota avalon 2016');
    const [repairCategory, setRepairCategory] = useState('Chancellor Place, Platt Halls');

    React.useEffect(() => {
        if (visible) {
            getCurrentUserLocation().catch(() => {});
        }
    }, [visible]);

    const handleStartSearch = () => {
        if (onStartSearch) {
            onStartSearch({
                meetUpLocation,
                selectedCar,
                repairCategory,
            });
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.backdrop}>
                {/* Backdrop dismiss touch area */}
                <Pressable style={styles.dismissArea} onPress={onClose} />

                {/* Solid Bottom Card strictly sized to its contents */}
                <SafeAreaView edges={['bottom']} style={styles.modalCard}>
                    {/* Centered Top Handle */}
                    <View style={styles.handleBar} />

                    {/* Header: Centered Caps Title & Close Button in Top Right */}
                    <View style={styles.header}>
                        <View style={styles.headerSidePlaceholder} />
                        <Text style={styles.headerTitle}>REPAIR LOCATION</Text>
                        <Button
                            type="ghost"
                            size="icon"
                            style={styles.headerCloseBtn}
                            onPress={onClose}
                            icon={<Ionicons name="close" size={22} color="#ffffff" />}
                        />
                    </View>

                    {/* Separation line touching side edges */}
                    <View style={styles.divider} />

                    {/* 3-Column Content View */}
                    <View style={styles.columnsContainer}>
                        {/* COLUMN 1: Indicator Timeline Spine */}
                        <RepairLocationTimeline />

                        {/* COLUMN 2: Middle Q & A Interactive Rows */}
                        <RepairLocationQA
                            meetUpLocation={meetUpLocation}
                            selectedCar={selectedCar}
                            repairCategory={repairCategory}
                            onPressLocation={onPressLocation}
                            onPressVehicle={onPressVehicle}
                            onChooseOrAddVehicle={onChooseOrAddVehicle}
                            onPressCategory={onPressCategory}
                        />

                        {/* COLUMN 3: Red Crosshair Sniper Target Icon */}
                        <View style={styles.rightColumn}>
                            <View style={styles.targetIconWrapper}>
                                <MaterialDesignIcons
                                    name="crosshairs-gps"
                                    size={20}
                                    color="white"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Footer with Modular Parallelogram Button */}
                    <View style={styles.footer}>
                        <ParallelogramButton
                            title="Start Search"
                            height={34}
                            width="90%"
                            onPress={handleStartSearch}
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalCard: {
        backgroundColor: '#121820',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderBottomWidth: 0,
        width: '100%',
    },
    handleBar: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    headerSidePlaceholder: {
        width: 36,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: 2,
        textAlign: 'center',
        flex: 1,
    },
    headerCloseBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    columnsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
    },
    rightColumn: {
        width: 38,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 2,
    },
    targetIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        paddingHorizontal: 8,
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
    },
});

export default RepairLocationModal;
