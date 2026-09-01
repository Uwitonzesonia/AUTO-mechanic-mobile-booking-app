import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export function RepairLocationTimeline() {
    return (
        <View style={styles.container}>
            <View style={styles.mapIconCircle}>
                <Ionicons name="location" size={16} color="#ffffff" />
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.carIconCircle}>
                <Ionicons name="car" size={24} color="#ff3b30" />
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.mapIconCircle}>
                <Ionicons name="location" size={16} color="#ffffff" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    mapIconCircle: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    carIconCircle: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verticalLine: {
        width: 1.5,
        flex: 1,
        minHeight: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 4,
    },
});

export default RepairLocationTimeline;
