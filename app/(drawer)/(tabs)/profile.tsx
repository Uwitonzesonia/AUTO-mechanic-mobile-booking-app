import React, { useLayoutEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import AntDesign from "@react-native-vector-icons/ant-design";
import { LinearBgView } from "@/components/LinearBg";
import { AlertDialog, Avatar, Button, DrawingCameraIcon } from "@/components/ui";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import CameraPickerModal from "@/components/camera/CameraPickerModal";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
    const { userProfile, user } = useAuth();
    const navigation = useNavigation();

    // Camera modal state
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(null);
    const [isMoreDialogOpen, setIsMoreDialogOpen] = useState(false);
    const galleryListRef = useRef<FlatList>(null);
    const scrollIndexRef = useRef(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <CustomHeader
                    title={"Your Profile"}
                    showBackButton={true}
                    headerInMiddle={true}
                    rightAction={
                        <Button
                            type="ghost"
                            size="icon"
                            onPress={() => setIsMoreDialogOpen(true)}
                            icon={<AntDesign name={"more"} size={24} color="white" />}
                        />
                    }
                />
            ),
        });
    }, [navigation]);

    const handleSelectImage = (uri: string) => {
        setGalleryImages(prev => [uri, ...prev]);
    };

    const handleScrollLeft = () => {
        if (scrollIndexRef.current > 0) {
            scrollIndexRef.current -= 1;
            galleryListRef.current?.scrollToIndex({
                index: scrollIndexRef.current,
                animated: true,
                viewPosition: 0,
            });
        }
    };

    const handleScrollRight = () => {
        const totalItems = galleryImages.length + 1;
        if (scrollIndexRef.current < totalItems - 1) {
            scrollIndexRef.current += 1;
            galleryListRef.current?.scrollToIndex({
                index: scrollIndexRef.current,
                animated: true,
                viewPosition: 0,
            });
        }
    };

    const confirmDeleteGalleryImage = () => {
        if (deleteTargetIndex !== null) {
            setGalleryImages(prev => prev.filter((_, idx) => idx !== deleteTargetIndex));
            if (selectedImage) setSelectedImage(null);
            setDeleteTargetIndex(null);
        }
    };

    return (
        <LinearBgView>
            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollView}
                >
                    {user && (
                        <View style={styles.infoContainer}>
                            <Avatar imageUrl={user?.photoURL || ""} avatarBorderWidth={4} avatarBorderColor={"#0094ff"} />
                            <Text style={[styles.text, styles.nameText]}>
                                {userProfile?.fullName || userProfile?.email}
                            </Text>
                            <Text style={[styles.roleText, styles.text]}>
                                {userProfile?.role?.toUpperCase()}
                            </Text>
                            <Text style={styles.descriptionText}>
                                A professional vehicle enthusiast and car collector
                            </Text>
                        </View>
                    )}

                    {/* Garage Section */}
                    <View style={styles.garageSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your garage</Text>
                            <Button
                                type="ghost"
                                style={styles.conditionBtn}
                                textStyle={styles.conditionText}
                                icon={<Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 4 }} />}
                                iconPosition="right"
                            >
                                Condition
                            </Button>
                        </View>
                        <View style={styles.garageImageContainer}>
                            <Image
                                source={require("../../../assets/images/cars/car1.png")}
                                style={styles.garageImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Gallery Section */}
                    <View style={styles.gallerySection}>
                        <View style={styles.galleryHeader}>
                            <View style={styles.galleryTitleRow}>
                                <Text style={styles.sectionTitle}>Gallery</Text>
                            </View>
                            <View style={styles.arrowControls}>
                                <Button
                                    type="secondary"
                                    size="icon"
                                    style={styles.arrowBtn}
                                    onPress={handleScrollLeft}
                                    activeOpacity={0.7}
                                    icon={<Ionicons name="chevron-back" size={20} color="white" />}
                                />
                                <Button
                                    type="secondary"
                                    size="icon"
                                    style={styles.arrowBtn}
                                    onPress={handleScrollRight}
                                    activeOpacity={0.7}
                                    icon={<Ionicons name="chevron-forward" size={20} color="white" />}
                                />
                            </View>
                        </View>

                        {/* Horizontal Gallery List with Camera Button */}
                        <FlatList
                            ref={galleryListRef}
                            data={['add_button', ...galleryImages]}
                            keyExtractor={(item, index) => (item === 'add_button' ? 'add_btn' : `${item}_${index}`)}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.galleryListContainer}
                            onScrollToIndexFailed={() => {}}
                            renderItem={({ item, index }) => {
                                if (item === 'add_button') {
                                    return (
                                        <Button
                                            type="custom"
                                            size="custom"
                                            style={styles.addPhotoCard}
                                            onPress={() => setIsCameraOpen(true)}
                                            activeOpacity={0.75}
                                        >
                                            <View style={styles.cameraIconWrapper}>
                                                <DrawingCameraIcon size={44} color="#0094ff" />
                                            </View>
                                            <Text style={styles.addPhotoText}>Take / Pick Photo</Text>
                                            <Text style={styles.addPhotoSubtext}>Camera & Gallery</Text>
                                        </Button>
                                    );
                                }

                                const photoIndex = index - 1;
                                return (
                                    <View style={styles.galleryPhotoCard}>
                                        <Button
                                            type="custom"
                                            size="custom"
                                            onPress={() => setSelectedImage(item)}
                                            activeOpacity={0.85}
                                            style={styles.photoTouchable}
                                        >
                                            <Image source={{ uri: item }} style={styles.galleryPhotoImage} />
                                        </Button>
                                        <Button
                                            type="custom"
                                            size="custom"
                                            style={styles.deletePhotoBtn}
                                            onPress={() => setDeleteTargetIndex(photoIndex)}
                                            activeOpacity={0.7}
                                            icon={<Ionicons name="trash" size={16} color="#ffffff" />}
                                        />
                                    </View>
                                );
                            }}
                        />
                    </View>

                    <View style={{ paddingVertical: 40 }} />
                </ScrollView>
            </SafeAreaView>

            {/* Camera Modal */}
            <CameraPickerModal
                visible={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
                onSelectImage={handleSelectImage}
            />

            {/* Delete Photo Confirmation Dialog */}
            <AlertDialog
                visible={deleteTargetIndex !== null}
                variant="danger"
                title="Remove Photo"
                message="Are you sure you want to remove this photo from your gallery?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteGalleryImage}
                onCancel={() => setDeleteTargetIndex(null)}
            />

            {/* More Actions Info Dialog */}
            <AlertDialog
                visible={isMoreDialogOpen}
                variant="info"
                title="Profile Options"
                message="More profile settings and actions will be available in the upcoming update."
                confirmText="Got it"
                onConfirm={() => setIsMoreDialogOpen(false)}
            />

            {/* Fullscreen Photo Viewer Modal */}
            {selectedImage && (
                <Modal
                    visible={!!selectedImage}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <SafeAreaView style={styles.modalBackdrop} edges={['top', 'bottom']}>
                        <Button
                            type="custom"
                            size="custom"
                            style={styles.modalCloseBtn}
                            onPress={() => setSelectedImage(null)}
                            activeOpacity={0.7}
                            icon={<Ionicons name="close" size={28} color="#fff" />}
                        />

                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.modalImage}
                            resizeMode="contain"
                        />
                    </SafeAreaView>
                </Modal>
            )}
        </LinearBgView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    nameText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    roleText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },
    text: {
        color: 'white',
    },
    infoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 10,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
        color: '#ccc',
        fontFamily: 'Montserrat-Regular',
    },
    garageSection: {
        backgroundColor: '#10181E',
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    conditionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    garageImageContainer: {
        width: '100%',
        height: 190,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    garageImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    gallerySection: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    galleryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    arrowControls: {
        flexDirection: 'row',
        gap: 10,
    },
    arrowBtn: {
        backgroundColor: '#1C293A',
        borderRadius: 10,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryListContainer: {
        paddingVertical: 6,
        gap: 14,
    },
    addPhotoCard: {
        width: 150,
        height: 180,
        borderRadius: 16,
        backgroundColor: '#131e2b',
        borderWidth: 1.5,
        borderColor: '#0094ff',
        borderStyle: 'dashed',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    cameraIconWrapper: {
        marginBottom: 12,
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(0, 148, 255, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    addPhotoSubtext: {
        color: '#0094ff',
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
    },
    galleryPhotoCard: {
        width: 150,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#1C293A',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    photoTouchable: {
        width: '100%',
        height: '100%',
    },
    galleryPhotoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    deletePhotoBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },
    modalImage: {
        width: SCREEN_WIDTH * 0.94,
        height: '80%',
    },
});
