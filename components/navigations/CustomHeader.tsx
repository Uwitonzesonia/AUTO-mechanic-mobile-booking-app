import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import {DrawerActions} from "expo-router/react-navigation";

interface CustomHeaderProps {
    title: string;
    rightAction?: React.ReactNode;
}

export default function CustomHeader({ title, rightAction }: CustomHeaderProps) {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <View style={styles.headerContainer}>
            <View style={{flexDirection: "row", gap: 8}}>
                <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                    <Ionicons name="menu" size={20} color="#ffffff" />
                </TouchableOpacity>

                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.rightContainer}>
                {rightAction ? rightAction : <View style={{ width: 26 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#000000",
    },
    menuButton: {
        padding: 4,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.18)",
    },
    title: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
    },
    rightContainer: {
        minWidth: 26,
        alignItems: "flex-end",
    },
});
