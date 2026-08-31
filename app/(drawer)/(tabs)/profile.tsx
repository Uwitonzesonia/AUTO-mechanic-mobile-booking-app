import React, { useLayoutEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import CustomHeader from "@/components/navigations/CustomHeader";
import AntDesign from "@react-native-vector-icons/ant-design";
import { LinearBgView } from "@/components/LinearBg";
import { Avatar } from "@/components/ui/Avatar";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import DrawingCameraIcon from "@/components/ui/DrawingCameraIcon";
import CameraPickerModal from "@/components/camera/CameraPickerModal";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
    const { userProfile, user } = useAuth();
    const navigation = useNavigation();

    // Camera modal state
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Gallery images state (user captured/picked images)
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
                        <TouchableOpacity onPress={() => Alert.alert("More", "More actions to be added.")}>
                            <AntDesign name={"more"} size={24} color="white" />
                        </TouchableOpacity>
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
        const totalItems = galleryImages.length + 1; // +1 for the Add button
        if (scrollIndexRef.current < totalItems - 1) {
            scrollIndexRef.current += 1;
            galleryListRef.current?.scrollToIndex({
                index: scrollIndexRef.current,
                animated: true,
                viewPosition: 0,
            });
        }
    };

    const handleDeleteGalleryImage = (indexToRemove: number) => {
        Alert.alert(
            "Remove Photo",
            "Are you sure you want to remove this photo from your gallery?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setGalleryImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
                        if (selectedImage) setSelectedImage(null);
                    },
                },
            ]
        );
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
                            <TouchableOpacity style={styles.conditionBtn}>
                                <Text style={styles.conditionText}>Condition</Text>
                                <Ionicons name="arrow-forward" size={18} color="#0094ff" style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={require("../../../assets/images/cars/garage1.png")}
                            style={styles.garageImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Gallery Section */}
                    <View style={styles.gallerySection}>
                        <View style={styles.galleryHeader}>
                            <View style={styles.galleryTitleRow}>
                                <Text style={styles.sectionTitle}>Gallery</Text>
                                {galleryImages.length > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{galleryImages.length}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.arrowControls}>
                                <TouchableOpacity
                                    style={styles.arrowBtn}
                                    onPress={handleScrollLeft}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="chevron-back" size={20} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.arrowBtn}
                                    onPress={handleScrollRight}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="chevron-forward" size={20} color="white" />
                                </TouchableOpacity>
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
                                        <TouchableOpacity
                                            style={styles.addPhotoCard}
                                            onPress={() => setIsCameraOpen(true)}
                                            activeOpacity={0.75}
                                        >
                                            <View style={styles.cameraIconWrapper}>
                                                <DrawingCameraIcon size={44} color="#0094ff" />
                                            </View>
                                            <Text style={styles.addPhotoText}>Take / Pick Photo</Text>
                                            <Text style={styles.addPhotoSubtext}>Camera & Gallery</Text>
                                        </TouchableOpacity>
                                    );
                                }

                                const photoIndex = index - 1;
                                return (
                                    <View style={styles.galleryPhotoCard}>
                                        <TouchableOpacity
                                            onPress={() => setSelectedImage(item)}
                                            activeOpacity={0.85}
                                            style={styles.photoTouchable}
                                        >
                                            <Image source={{ uri: item }} style={styles.galleryPhotoImage} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deletePhotoBtn}
                                            onPress={() => handleDeleteGalleryImage(photoIndex)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="trash-outline" size={16} color="#fff" />
                                        </TouchableOpacity>
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

            {/* Fullscreen Photo Viewer Modal */}
            {selectedImage && (
                <Modal
                    visible={!!selectedImage}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectedImage(null)}
                >
                    <SafeAreaView style={styles.modalBackdrop} edges={['top', 'bottom']}>
                        <TouchableOpacity
                            style={styles.modalCloseBtn}
                            onPress={() => setSelectedImage(null)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>

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
    },
    conditionText: {
        color: '#0094ff',
        fontSize: 14,
        fontWeight: '600',
    },
    garageImage: {
        width: '100%',
        height: 180,
        borderRadius: 14,
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
    badge: {
        backgroundColor: '#0094ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
    },
    cameraIconWrapper: {
        marginBottom: 12,
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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
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