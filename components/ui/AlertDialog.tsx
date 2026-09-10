import React from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Button, ButtonType } from './Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type DialogVariant = 'info' | 'success' | 'warning' | 'danger';

export interface DialogAction {
    text: string;
    onPress?: () => void | Promise<void>;
    variant?: ButtonType;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export interface AlertDialogProps {
    /** Controls modal visibility */
    visible: boolean;
    /** Header title for the alert/dialog */
    title: string;
    /** Descriptive message or body text */
    message?: string;
    /** Visual theme / preset of the dialog */
    variant?: DialogVariant;
    /** Custom icon or icon name override */
    icon?: React.ReactNode;
    /** Text for primary confirm button (default: 'OK' or 'Confirm') */
    confirmText?: string;
    /** Text for secondary cancel button (if omitted, cancel button is not rendered) */
    cancelText?: string;
    /** Button preset for confirm button (defaults based on variant) */
    confirmVariant?: ButtonType;
    /** Button preset for cancel button */
    cancelVariant?: ButtonType;
    /** Callback when confirm button is pressed */
    onConfirm?: () => void | Promise<void>;
    /** Callback when cancel button is pressed */
    onCancel?: () => void;
    /** Callback when dialog is closed or dismissed */
    onClose?: () => void;
    /** Whether tapping the backdrop dismisses the dialog (default: true) */
    dismissable?: boolean;
    /** Shows loading spinner on confirm button */
    loading?: boolean;
    /** Custom action buttons array (overrides confirmText & cancelText) */
    actions?: DialogAction[];
    /** Custom children inside dialog body */
    children?: React.ReactNode;
    /** Additional styles for the dialog container */
    style?: StyleProp<ViewStyle>;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const variantConfig: Record<
    DialogVariant,
    {
        iconName: IoniconsName;
        color: string;
        bgColor: string;
        defaultConfirmVariant: ButtonType;
    }
> = {
    info: {
        iconName: 'information-circle-outline',
        color: '#0094ff',
        bgColor: 'rgba(0, 148, 255, 0.12)',
        defaultConfirmVariant: 'primary',
    },
    success: {
        iconName: 'checkmark-circle-outline',
        color: '#10B981',
        bgColor: 'rgba(16, 185, 129, 0.12)',
        defaultConfirmVariant: 'primary',
    },
    warning: {
        iconName: 'alert-circle-outline',
        color: '#F59E0B',
        bgColor: 'rgba(245, 158, 11, 0.12)',
        defaultConfirmVariant: 'primary',
    },
    danger: {
        iconName: 'trash-outline',
        color: '#EF4444',
        bgColor: 'rgba(239, 68, 68, 0.12)',
        defaultConfirmVariant: 'danger',
    },
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
    visible,
    title,
    message,
    variant = 'info',
    icon,
    confirmText = 'OK',
    cancelText,
    confirmVariant,
    cancelVariant = 'ghost',
    onConfirm,
    onCancel,
    onClose,
    dismissable = true,
    loading = false,
    actions,
    children,
    style,
}) => {
    const currentVariant = variantConfig[variant] || variantConfig.info;

    const handleDismiss = () => {
        if (loading) return;
        if (onClose) {
            onClose();
        } else if (onCancel) {
            onCancel();
        }
    };

    const handleConfirm = async () => {
        if (loading) return;
        if (onConfirm) {
            await onConfirm();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (loading) return;
        if (onCancel) {
            onCancel();
        }
        if (onClose) {
            onClose();
        }
    };

    const renderIcon = () => {
        if (icon !== undefined) {
            return icon;
        }

        return (
            <View style={[styles.iconHalo, { backgroundColor: currentVariant.bgColor }]}>
                <Ionicons
                    name={currentVariant.iconName}
                    size={32}
                    color={currentVariant.color}
                />
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={dismissable ? handleDismiss : undefined}
        >
            <View style={styles.backdrop}>
                <Pressable
                    style={styles.dismissArea}
                    onPress={dismissable ? handleDismiss : undefined}
                />

                <View style={[styles.dialogCard, style]}>
                    {/* Header Icon */}
                    <View style={styles.iconContainer}>{renderIcon()}</View>

                    {/* Title & Message */}
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>{title}</Text>
                        {message ? <Text style={styles.messageText}>{message}</Text> : null}
                    </View>

                    {/* Optional custom children */}
                    {children ? <View style={styles.customContent}>{children}</View> : null}

                    {/* Action Buttons */}
                    <View style={styles.actionsContainer}>
                        {actions && actions.length > 0 ? (
                            actions.map((action, index) => (
                                <Button
                                    key={index}
                                    type={action.variant || 'secondary'}
                                    size="md"
                                    fullWidth
                                    title={action.text}
                                    loading={action.loading}
                                    disabled={loading}
                                    style={action.style}
                                    textStyle={action.textStyle}
                                    onPress={async () => {
                                        if (action.onPress) {
                                            await action.onPress();
                                        }
                                        if (onClose) onClose();
                                    }}
                                />
                            ))
                        ) : (
                            <View
                                style={[
                                    styles.defaultActionsRow,
                                    !cancelText && styles.singleActionRow,
                                ]}
                            >
                                {cancelText ? (
                                    <Button
                                        type={cancelVariant}
                                        size="md"
                                        style={styles.actionBtn}
                                        title={cancelText}
                                        disabled={loading}
                                        onPress={handleCancel}
                                    />
                                ) : null}

                                <Button
                                    type={confirmVariant || currentVariant.defaultConfirmVariant}
                                    size="md"
                                    style={styles.actionBtn}
                                    title={confirmText}
                                    loading={loading}
                                    onPress={handleConfirm}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export const Dialog = AlertDialog;
export default AlertDialog;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    dismissArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    dialogCard: {
        width: '100%',
        maxWidth: Math.min(SCREEN_WIDTH - 48, 380),
        backgroundColor: '#101822',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
        gap: 16,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconHalo: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    titleText: {
        fontSize: 19,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
    },
    messageText: {
        fontSize: 14,
        color: '#9ba8b8',
        textAlign: 'center',
        lineHeight: 20,
    },
    customContent: {
        width: '100%',
    },
    actionsContainer: {
        width: '100%',
        marginTop: 4,
        gap: 10,
    },
    defaultActionsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    singleActionRow: {
        justifyContent: 'center',
    },
    actionBtn: {
        flex: 1,
    },
});
