import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Button } from '@/components/ui';

export interface CameraPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectImage: (uri: string) => void;
}

export default function CameraPickerModal({
    visible,
    onClose,
    onSelectImage,
}: CameraPickerModalProps) {
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [isGalleryLoading, setIsGalleryLoading] = useState(false);

    const handleClose = () => {
        setPreviewUri(null);
        setIsCameraLoading(false);
        setIsGalleryLoading(false);
        onClose();
    };

    const handleTakePhoto = async () => {
        try {
            setIsCameraLoading(true);
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Camera Permission Required',
                    'Please grant camera permissions in your device settings to take photos.'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.85,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setPreviewUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error launching camera:', error);
            Alert.alert('Camera Error', 'Could not open camera. Please try again.');
        } finally {
            setIsCameraLoading(false);
        }
    };

    const handlePickFromGallery = async () => {
        try {
            setIsGalleryLoading(true);
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Gallery Permission Required',
                    'Please grant media library permissions in your device settings to choose photos.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.85,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                setPreviewUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error launching image library:', error);
            Alert.alert('Gallery Error', 'Could not open photo library. Please try again.');
        } finally {
            setIsGalleryLoading(false);
        }
    };

    const handleConfirmPhoto = () => {
        if (previewUri) {
            onSelectImage(previewUri);
            handleClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.backdropOverlay}>
                <Pressable style={styles.dismissArea} onPress={handleClose} />

                <SafeAreaView edges={['bottom']} style={styles.sheetSafeArea}>
                    <View style={styles.sheetContent}>
                        <View style={styles.dragHandle} />

                        <View style={styles.headerRow}>
                            <View style={styles.headerTextGroup}>
                                <Text style={styles.titleText}>
                                    {previewUri ? 'Confirm Photo' : 'Add Photo'}
                                </Text>
                                <Text style={styles.subtitleText}>
                                    {previewUri
                                        ? 'Preview your selected photo before adding'
                                        : 'Choose an option to upload your photo'}
                                </Text>
                            </View>
                            <Button
                                type="ghost"
                                size="icon"
                                onPress={handleClose}
                                icon={<Ionicons name="close" size={22} color="#9ba8b8" />}
                            />
                        </View>

                        {previewUri && (
                            <View style={styles.previewImageContainer}>
                                <Image
                                    source={{ uri: previewUri }}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                            </View>
                        )}

                        <View style={styles.buttonGroup}>
                            {previewUri ? (
                                <>
                                    <Button
                                        type="primary"
                                        size="lg"
                                        fullWidth
                                        title="Use Photo"
                                        icon={<Ionicons name="checkmark-circle" size={20} color="#fff" />}
                                        onPress={handleConfirmPhoto}
                                    />
                                    <Button
                                        type="secondary"
                                        size="md"
                                        fullWidth
                                        title="Retake / Pick Another"
                                        icon={<Ionicons name="refresh" size={18} color="#fff" />}
                                        onPress={() => setPreviewUri(null)}
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        size="lg"
                                        fullWidth
                                        title="Take Photo"
                                        icon={<Ionicons name="camera" size={22} color="#fff" />}
                                        loading={isCameraLoading}
                                        disabled={isGalleryLoading}
                                        onPress={handleTakePhoto}
                                    />
                                    <Button
                                        type="secondary"
                                        size="lg"
                                        fullWidth
                                        title="Choose from Gallery"
                                        icon={<Ionicons name="images" size={22} color="#0094ff" />}
                                        loading={isGalleryLoading}
                                        disabled={isCameraLoading}
                                        onPress={handlePickFromGallery}
                                    />
                                </>
                            )}

                            <Button
                                type="ghost"
                                size="sm"
                                fullWidth
                                title="Cancel"
                                onPress={handleClose}
                                textStyle={styles.cancelText}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdropOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    sheetSafeArea: {
        backgroundColor: '#101822',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderBottomWidth: 0,
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        gap: 16,
    },
    dragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignSelf: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTextGroup: {
        flex: 1,
        paddingRight: 12,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 14,
        color: '#9ba8b8',
    },
    buttonGroup: {
        gap: 12,
    },
    previewImageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(0, 148, 255, 0.4)',
        backgroundColor: '#10181E',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    cancelText: {
        color: '#9ba8b8',
    },
});
