import React, {useState} from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import {Ionicons} from "@react-native-vector-icons/ionicons";

export interface PaymentOption {
    id: string;
    title: string;
    icon: any;
    color: string;
}

export const DEFAULT_PAYMENT_METHODS: PaymentOption[] = [
    {id: "cash", title: "Cash", icon: "cash-outline", color: "#22c55e"},
    {id: "momo", title: "Mobile Money (MoMo)", icon: "phone-portrait-outline", color: "#eab308"},
    {id: "bank", title: "Bank Transfer", icon: "card-outline", color: "#0094ff"},
];

interface PaymentMethodSelectorProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
    options?: PaymentOption[];
    style?: StyleProp<ViewStyle>;
}

export function PaymentMethodSelector({
                                          selectedId,
                                          onSelect,
                                          options = DEFAULT_PAYMENT_METHODS,
                                          style,
                                      }: PaymentMethodSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.id === selectedId);

    return (
        <View style={[styles.container, style]}>
            <Pressable
                style={[styles.trigger, isOpen && styles.triggerOpen]}
                onPress={() => setIsOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel="Select payment method"
            >
                <View style={styles.optionContent}>
                    {selectedOption ? (
                        <>
                            <View
                                style={[
                                    styles.iconBadge,
                                    {backgroundColor: `${selectedOption.color}20`},
                                ]}
                            >
                                <Ionicons
                                    name={selectedOption.icon}
                                    size={18}
                                    color={selectedOption.color}
                                />
                            </View>
                            <Text style={styles.selectedLabel}>{selectedOption.title}</Text>
                        </>
                    ) : (
                        <Text style={styles.placeholder}>Select Payment Method</Text>
                    )}
                </View>

                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#9ba8b8"
                />
            </Pressable>

            {isOpen && (
                <View style={styles.menu}>
                    {options.map((option, index) => {
                        const isSelected = option.id === selectedId;
                        const isLast = index === options.length - 1;

                        return (
                            <Pressable
                                key={option.id}
                                style={[
                                    styles.menuItem,
                                    isSelected && styles.menuItemSelected,
                                    !isLast && styles.menuItemBorder,
                                ]}
                                onPress={() => {
                                    onSelect(option.id);
                                    setIsOpen(false);
                                }}
                            >
                                <View style={styles.optionContent}>
                                    <View
                                        style={[
                                            styles.iconBadge,
                                            {backgroundColor: `${option.color}20`},
                                        ]}
                                    >
                                        <Ionicons
                                            name={option.icon}
                                            size={18}
                                            color={option.color}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.itemLabel,
                                            isSelected && styles.itemLabelSelected,
                                        ]}
                                    >
                                        {option.title}
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
    );
}

const styles = StyleSheet.create({
    container: {
        width: "90%",
        marginVertical: 8,
    },
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#161e28",
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.1)",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    triggerOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    optionContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    selectedLabel: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "600",
    },
    placeholder: {
        color: "#8292a4",
        fontSize: 15,
    },
    menu: {
        backgroundColor: "#131b24",
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    menuItemSelected: {
        backgroundColor: "rgba(0, 148, 255, 0.12)",
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.06)",
    },
    iconBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    itemLabel: {
        color: "#9ba8b8",
        fontSize: 15,
        fontWeight: "500",
    },
    itemLabelSelected: {
        color: "#ffffff",
        fontWeight: "600",
    },
});
