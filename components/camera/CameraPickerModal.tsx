import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import {
    Asset,
    AssetField,
    MediaType,
    Query,
    usePermissions as useMediaLibraryPermissions,
} from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface MediaPhotoItem {
    id: string;
    uri: string;
}

interface CameraPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectImage: (uri: string) => void;
}

export default function CameraPickerModal({
    visible,
    onClose,
    onSelectImage,
}: CameraPickerModalProps) {
    const cameraRef = useRef<CameraView>(null);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [mediaPermission, requestMediaPermission] = useMediaLibraryPermissions();

    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [torch, setTorch] = useState<boolean>(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    // Recent media assets for horizontal gallery strip
    const [recentPhotos, setRecentPhotos] = useState<MediaPhotoItem[]>([]);
    const [isLoadingMedia, setIsLoadingMedia] = useState(false);

    // Preview state (after taking a photo or selecting from gallery)
    const [previewUri, setPreviewUri] = useState<string | null>(null);

    // Double tap handling to flip camera
    const lastTapRef = useRef<number>(0);

    useEffect(() => {
        if (visible) {
            loadRecentPhotos();
        } else {
            setPreviewUri(null);
            setIsCapturing(false);
            setTorch(false);
        }
    }, [visible]);

    const loadRecentPhotos = async () => {
        try {
            let perm = mediaPermission;
            if (!perm || !perm.granted) {
                perm = await requestMediaPermission();
            }

            if (perm?.granted) {
                setIsLoadingMedia(true);
                const assets = await new Query()
                    .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
                    .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
                    .limit(30)
                    .exe();

                const resolvedPhotos = await Promise.all(
                    assets.map(async (asset: Asset) => {
                        try {
                            const uri = await asset.getUri();
                            return { id: asset.id, uri: uri || asset.id };
                        } catch {
                            return { id: asset.id, uri: asset.id };
                        }
                    })
                );

                setRecentPhotos(resolvedPhotos);
            }
        } catch (error) {
            console.warn('Error loading recent photos:', error);
        } finally {
            setIsLoadingMedia(false);
        }
    };

    const toggleFacing = () => {
        setFacing(prev => (prev === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlash(prev => {
            if (prev === 'off') return 'on';
            if (prev === 'on') return 'auto';
            return 'off';
        });
    };

    const toggleTorch = () => {
        setTorch(prev => !prev);
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            toggleFacing();
        }
        lastTapRef.current = now;
    };

    const takePicture = async () => {
        if (!cameraRef.current || !isCameraReady || isCapturing) return;

        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.9,
                skipProcessing: false,
            });

            if (photo?.uri) {
                setPreviewUri(photo.uri);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const pickFromSystemGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setPreviewUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error launching image library:', error);
        }
    };

    const handleSelectRecentPhoto = (photo: MediaPhotoItem) => {
        setPreviewUri(photo.uri);
    };

    const handleConfirmPhoto = () => {
        if (previewUri) {
            onSelectImage(previewUri);
            setPreviewUri(null);
            onClose();
        }
    };

    const handleRetake = () => {
        setPreviewUri(null);
    };

    if (!visible) return null;

    // Handle Camera Permissions Screen
    if (!cameraPermission?.granted) {
        return (
            <Modal visible={visible} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.permissionContainer} edges={['top', 'bottom']}>
                    <StatusBar barStyle="light-content" backgroundColor="#000" />
                    <TouchableOpacity style={styles.permissionCloseBtn} onPress={onClose}>
                        <Ionicons name="close" size={30} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.permissionContent}>
                        <View style={styles.permissionIconCircle}>
                            <Ionicons name="camera-outline" size={54} color="#0094ff" />
                        </View>
                        <Text style={styles.permissionTitle}>Camera Access Required</Text>
                        <Text style={styles.permissionMessage}>
                            To take photos and pick images, allow AUTO Mechanic to access your camera and gallery.
                        </Text>
                        <TouchableOpacity
                            style={styles.permissionGrantBtn}
                            onPress={requestCameraPermission}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.permissionGrantBtnText}>Allow Camera Access</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#000" />

                {previewUri ? (
                    /* ----------------- PHOTO PREVIEW SCREEN ----------------- */
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />

                        {/* Top Preview Bar */}
                        <SafeAreaView style={styles.previewTopBar} edges={['top']}>
                            <TouchableOpacity
                                style={styles.previewIconBtn}
                                onPress={handleRetake}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="arrow-back" size={26} color="#fff" />
                            </TouchableOpacity>

                            <View style={styles.previewTopRightActions}>
                                <TouchableOpacity
                                    style={styles.previewIconBtn}
                                    onPress={handleRetake}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="refresh-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>

                        {/* Bottom Preview Confirmation Bar */}
                        <SafeAreaView style={styles.previewBottomBar} edges={['bottom']}>
                            <View style={styles.previewBottomInner}>
                                <TouchableOpacity
                                    style={styles.retakeButton}
                                    onPress={handleRetake}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close-circle-outline" size={22} color="#fff" />
                                    <Text style={styles.retakeText}>Retake</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleConfirmPhoto}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.confirmButtonText}>Use Photo</Text>
                                    <View style={styles.sendIconCircle}>
                                        <Ionicons name="checkmark" size={22} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>
                ) : (
                    /* ----------------- LIVE CAMERA VIEWFINDER ----------------- */
                    <Pressable style={styles.cameraPressable} onPress={handleDoubleTap}>
                        <CameraView
                            ref={cameraRef}
                            style={StyleSheet.absoluteFill}
                            facing={facing}
                            flash={flash}
                            enableTorch={torch}
                            onCameraReady={() => setIsCameraReady(true)}
                        />

                        {/* Top Controls Overlay */}
                        <SafeAreaView style={styles.topControls} edges={['top']}>
                            <TouchableOpacity
                                style={styles.topIconBtn}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={30} color="#fff" />
                            </TouchableOpacity>

                            <View style={styles.topRightControls}>
                                {/* Torch Toggle */}
                                <TouchableOpacity
                                    style={[styles.topIconBtn, torch && styles.activeIconBtn]}
                                    onPress={toggleTorch}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={torch ? 'flashlight' : 'flashlight-outline'}
                                        size={24}
                                        color={torch ? '#FFD700' : '#fff'}
                                    />
                                </TouchableOpacity>

                                {/* Flash Mode Toggle */}
                                <TouchableOpacity
                                    style={[styles.topIconBtn, flash !== 'off' && styles.activeIconBtn]}
                                    onPress={toggleFlash}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={
                                            flash === 'on'
                                                ? 'flash'
                                                : flash === 'auto'
                                                ? 'flash-outline'
                                                : 'flash-off'
                                        }
                                        size={24}
                                        color={flash !== 'off' ? '#FFD700' : '#fff'}
                                    />
                                    {flash === 'auto' && (
                                        <Text style={styles.flashAutoBadge}>A</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>

                        {/* Bottom Container: Recent Photos Strip + Shutter Controls */}
                        <View style={styles.bottomControlsContainer}>
                            {/* Horizontal Recent Photos Strip */}
                            <View style={styles.recentMediaSection}>
                                <View style={styles.recentMediaHeader}>
                                    <Text style={styles.recentMediaTitle}>Recent photos</Text>
                                    <TouchableOpacity
                                        onPress={pickFromSystemGallery}
                                        style={styles.browseAllBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.browseAllText}>Gallery</Text>
                                        <Ionicons name="chevron-forward" size={14} color="#0094ff" />
                                    </TouchableOpacity>
                                </View>

                                {isLoadingMedia ? (
                                    <View style={styles.mediaLoadingContainer}>
                                        <ActivityIndicator size="small" color="#0094ff" />
                                    </View>
                                ) : (
                                    <FlatList
                                        data={recentPhotos}
                                        keyExtractor={item => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.recentPhotosList}
                                        ListHeaderComponent={
                                            <TouchableOpacity
                                                style={styles.galleryCardItem}
                                                onPress={pickFromSystemGallery}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="images-outline" size={24} color="#0094ff" />
                                                <Text style={styles.galleryCardText}>All</Text>
                                            </TouchableOpacity>
                                        }
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.thumbnailWrapper}
                                                onPress={() => handleSelectRecentPhoto(item)}
                                                activeOpacity={0.8}
                                            >
                                                <Image
                                                    source={{ uri: item.uri }}
                                                    style={styles.thumbnailImage}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                            </View>

                            {/* Main Camera Action Bar */}
                            <SafeAreaView style={styles.shutterBar} edges={['bottom']}>
                                <View style={styles.shutterBarInner}>
                                    {/* Left: Gallery Picker Button */}
                                    <TouchableOpacity
                                        style={styles.actionCircleBtn}
                                        onPress={pickFromSystemGallery}
                                        activeOpacity={0.7}
                                        accessibilityLabel="Open gallery"
                                    >
                                        <Ionicons name="images" size={26} color="#fff" />
                                    </TouchableOpacity>

                                    {/* Center: Shutter Button */}
                                    <TouchableOpacity
                                        style={styles.shutterOuterRing}
                                        onPress={takePicture}
                                        disabled={isCapturing}
                                        activeOpacity={0.85}
                                        accessibilityLabel="Take picture"
                                    >
                                        <View
                                            style={[
                                                styles.shutterInnerCircle,
                                                isCapturing && styles.shutterCapturing,
                                            ]}
                                        >
                                            {isCapturing && (
                                                <ActivityIndicator size="small" color="#000" />
                                            )}
                                        </View>
                                    </TouchableOpacity>

                                    {/* Right: Flip Camera Button */}
                                    <TouchableOpacity
                                        style={styles.actionCircleBtn}
                                        onPress={toggleFacing}
                                        activeOpacity={0.7}
                                        accessibilityLabel="Flip camera"
                                    >
                                        <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.shutterHintText}>Tap for photo • Double tap to flip</Text>
                            </SafeAreaView>
                        </View>
                    </Pressable>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraPressable: {
        flex: 1,
        justifyContent: 'space-between',
    },
    /* Permission screen styles */
    permissionContainer: {
        flex: 1,
        backgroundColor: '#0d131a',
        paddingHorizontal: 24,
    },
    permissionCloseBtn: {
        alignSelf: 'flex-start',
        padding: 12,
        marginTop: 10,
    },
    permissionContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
    },
    permissionIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 148, 255, 0.12)',
        borderWidth: 1.5,
        borderColor: '#0094ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionMessage: {
        fontSize: 15,
        color: '#9ba8b8',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    permissionGrantBtn: {
        backgroundColor: '#0094ff',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: '#0094ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    permissionGrantBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    /* Top Camera Controls */
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 16 : 6,
        zIndex: 10,
    },
    topRightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIconBtn: {
        backgroundColor: 'rgba(255, 215, 0, 0.25)',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    flashAutoBadge: {
        position: 'absolute',
        bottom: 7,
        right: 9,
        fontSize: 9,
        fontWeight: '900',
        color: '#FFD700',
    },
    /* Bottom Controls */
    bottomControlsContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    },
    /* Recent Photos Strip */
    recentMediaSection: {
        marginBottom: 10,
    },
    recentMediaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    recentMediaTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.85)',
        letterSpacing: 0.3,
    },
    browseAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    browseAllText: {
        fontSize: 13,
        color: '#0094ff',
        fontWeight: '600',
    },
    recentPhotosList: {
        paddingHorizontal: 14,
        gap: 8,
    },
    mediaLoadingContainer: {
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryCardItem: {
        width: 62,
        height: 62,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 148, 255, 0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(0, 148, 255, 0.5)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    galleryCardText: {
        fontSize: 11,
        color: '#0094ff',
        fontWeight: '600',
        marginTop: 2,
    },
    thumbnailWrapper: {
        width: 62,
        height: 62,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        backgroundColor: '#1C293A',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
    },
    /* Shutter bar */
    shutterBar: {
        paddingTop: 6,
    },
    shutterBarInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 24,
    },
    actionCircleBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shutterOuterRing: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 4,
        borderColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    shutterInnerCircle: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shutterCapturing: {
        backgroundColor: '#e0e0e0',
        transform: [{ scale: 0.88 }],
    },
    shutterHintText: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.65)',
        fontSize: 11,
        marginTop: 8,
    },
    /* Photo Preview Styles */
    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'space-between',
    },
    previewImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    previewTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 16 : 6,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    previewTopRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    previewIconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewBottomBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    previewBottomInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    retakeText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#0094ff',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 10,
        borderRadius: 28,
        shadowColor: '#0094ff',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    sendIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
