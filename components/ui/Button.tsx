import React from "react";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    PressableStateCallbackType,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

export type ButtonType = "primary" | "secondary" | "outline" | "ghost" | "danger" | "link" | "custom";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "custom";
export type IconPosition = "left" | "right";

export interface ButtonProps extends Omit<PressableProps, "style" | "children"> {
    /** Text to display inside the button */
    title?: string;
    /** Children elements (can be string or React components) */
    children?: React.ReactNode | ((state: PressableStateCallbackType) => React.ReactNode);
    /** Button appearance style preset (alias of variant) */
    type?: ButtonType;
    /** Button appearance style preset */
    variant?: ButtonType;
    /** Size preset for padding and typography */
    size?: ButtonSize;
    /** Icon element or render function */
    icon?: React.ReactNode | ((props: { size: number; color: string }) => React.ReactNode);
    /** Placement of the icon relative to the text (default: 'left') */
    iconPosition?: IconPosition;
    /** Shows loading spinner instead of content/icon */
    loading?: boolean;
    /** Alias for loading */
    isLoading?: boolean;
    /** Color for the ActivityIndicator */
    loadingColor?: string;
    /** Stretches the button to full width */
    fullWidth?: boolean;
    /** Active opacity when pressed (default: 0.75) */
    activeOpacity?: number;
    /** Additional style for the button container */
    style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
    /** Additional style for the text label */
    textStyle?: StyleProp<TextStyle>;
    /** Additional style for the icon wrapper */
    iconStyle?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonType, { container: ViewStyle; text: TextStyle; iconColor: string }> = {
    primary: {
        container: {
            backgroundColor: "#0094ff",
            borderColor: "transparent",
        },
        text: {
            color: "#ffffff",
        },
        iconColor: "#ffffff",
    },
    secondary: {
        container: {
            backgroundColor: "#1C293A",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
        },
        text: {
            color: "#ffffff",
        },
        iconColor: "#ffffff",
    },
    outline: {
        container: {
            backgroundColor: "transparent",
            borderWidth: 1.5,
            borderColor: "#0094ff",
        },
        text: {
            color: "#0094ff",
        },
        iconColor: "#0094ff",
    },
    ghost: {
        container: {
            backgroundColor: "transparent",
            borderWidth: 0,
        },
        text: {
            color: "#ffffff",
        },
        iconColor: "#ffffff",
    },
    danger: {
        container: {
            backgroundColor: "#e53935",
            borderColor: "transparent",
        },
        text: {
            color: "#ffffff",
        },
        iconColor: "#ffffff",
    },
    link: {
        container: {
            backgroundColor: "transparent",
            paddingHorizontal: 0,
            paddingVertical: 0,
            borderWidth: 0,
        },
        text: {
            color: "#0094ff",
        },
        iconColor: "#0094ff",
    },
    custom: {
        container: {},
        text: {
            color: "#ffffff",
        },
        iconColor: "#ffffff",
    },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle; iconSize: number }> = {
    sm: {
        container: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            gap: 6,
        },
        text: {
            fontSize: 13,
        },
        iconSize: 16,
    },
    md: {
        container: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            gap: 8,
        },
        text: {
            fontSize: 15,
        },
        iconSize: 20,
    },
    lg: {
        container: {
            paddingVertical: 16,
            paddingHorizontal: 22,
            borderRadius: 14,
            gap: 10,
        },
        text: {
            fontSize: 17,
        },
        iconSize: 24,
    },
    icon: {
        container: {
            padding: 8,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontSize: 14,
        },
        iconSize: 20,
    },
    custom: {
        container: {},
        text: {},
        iconSize: 20,
    },
};

export const Button: React.FC<ButtonProps> = ({
    title,
    children,
    type,
    variant,
    size = "md",
    icon,
    iconPosition = "left",
    loading = false,
    isLoading = false,
    loadingColor,
    disabled = false,
    fullWidth = false,
    activeOpacity = 0.75,
    style,
    textStyle,
    iconStyle,
    android_ripple,
    ...restProps
}) => {
    // Resolve variant / type (variant takes precedence, defaults to primary)
    const activeType: ButtonType = variant || type || "primary";
    const isButtonLoading = loading || isLoading;
    const isButtonDisabled = disabled || isButtonLoading;

    const currentVariant = variantStyles[activeType] || variantStyles.primary;
    const currentSize = sizeStyles[size] || sizeStyles.md;

    const renderIcon = () => {
        if (!icon) return null;

        const resolvedIcon =
            typeof icon === "function"
                ? icon({ size: currentSize.iconSize, color: currentVariant.iconColor })
                : icon;

        return <View style={[styles.iconWrapper, iconStyle]}>{resolvedIcon}</View>;
    };

    const renderLabel = () => {
        if (title) {
            return (
                <Text
                    style={[
                        styles.defaultText,
                        currentVariant.text,
                        currentSize.text,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            );
        }

        if (typeof children === "string") {
            return (
                <Text
                    style={[
                        styles.defaultText,
                        currentVariant.text,
                        currentSize.text,
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            );
        }

        return null;
    };

    const isComplexChildren =
        children !== undefined && typeof children !== "string" && !title && !icon;

    return (
        <Pressable
            disabled={isButtonDisabled}
            android_ripple={
                android_ripple !== undefined
                    ? android_ripple
                    : activeType !== "link" && activeType !== "ghost"
                    ? { color: "rgba(255, 255, 255, 0.15)" }
                    : undefined
            }
            style={(state) => {
                const resolvedCustomStyle =
                    typeof style === "function" ? style(state) : style;

                return [
                    styles.baseButton,
                    !isComplexChildren && styles.rowButton,
                    currentVariant.container,
                    currentSize.container,
                    fullWidth && styles.fullWidth,
                    isButtonDisabled && styles.disabled,
                    state.pressed && !isButtonDisabled && { opacity: activeOpacity },
                    resolvedCustomStyle,
                ];
            }}
            accessibilityRole="button"
            accessibilityState={{ disabled: isButtonDisabled, busy: isButtonLoading }}
            {...restProps}
        >
            {(state) => {
                if (isButtonLoading) {
                    return (
                        <ActivityIndicator
                            color={loadingColor || currentVariant.iconColor}
                            size="small"
                        />
                    );
                }

                if (isComplexChildren) {
                    return typeof children === "function" ? children(state) : children;
                }

                return (
                    <>
                        {iconPosition === "left" && renderIcon()}
                        {renderLabel()}
                        {iconPosition === "right" && renderIcon()}
                    </>
                );
            }}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    baseButton: {
        alignItems: "center",
        justifyContent: "center",
    },
    rowButton: {
        flexDirection: "row",
    },
    defaultText: {
        fontWeight: "600",
        textAlign: "center",
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    fullWidth: {
        width: "100%",
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
