import React, {useEffect, useRef, useState} from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {Avatar, Button} from "@/components/ui";
import {getMechanicAvatarUrl, getMechanicName} from "../detail/types";
import type {Mechanic} from "@/types/mechanic";

const {height: SCREEN_HEIGHT} = Dimensions.get("window");
const MODAL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.7);

export interface RatingModalProps {
    visible: boolean;
    mechanic: Mechanic | null;
    onClose: () => void;
    onSubmit?: (data: { rating: number; comment: string }) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
                                                            visible,
                                                            mechanic,
                                                            onClose,
                                                            onSubmit,
                                                        }) => {
    const [selectedStars, setSelectedStars] = useState(5);
    const [comment, setComment] = useState("");
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const keyboardOffsetAnim = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const mechanicName = mechanic ? getMechanicName(mechanic) : "Your Mechanic";
    const avatarUrl = mechanic ? getMechanicAvatarUrl(mechanic) : undefined;

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showKeyboard = Keyboard.addListener(showEvent, (e) => {
            const height = e?.endCoordinates?.height ?? 280;
            setIsKeyboardVisible(true);
            Animated.timing(keyboardOffsetAnim, {
                toValue: height,
                duration: process.env.NODE_ENV === "test" ? 0 : (e?.duration || 250),
                useNativeDriver: false,
            }).start();
        });

        const hideKeyboard = Keyboard.addListener(hideEvent, (e) => {
            setIsKeyboardVisible(false);
            Animated.timing(keyboardOffsetAnim, {
                toValue: 0,
                duration: process.env.NODE_ENV === "test" ? 0 : (e?.duration || 250),
                useNativeDriver: false,
            }).start();
        });

        return () => {
            showKeyboard.remove();
            hideKeyboard.remove();
        };
    }, [keyboardOffsetAnim]);

    useEffect(() => {
        if (!visible) {
            setComment("");
            setSelectedStars(5);
            keyboardOffsetAnim.setValue(0);
        }
    }, [visible, keyboardOffsetAnim]);

    const handleSubmit = () => {
        Keyboard.dismiss();
        if (onSubmit) {
            onSubmit({
                rating: selectedStars,
                comment: comment.trim(),
            });
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View
                testID="rating-keyboard-avoiding-view"
                style={[styles.backdrop, {paddingBottom: keyboardOffsetAnim}]}
            >
                <Pressable
                    testID="rating-dismiss-area"
                    style={styles.dismissArea}
                    onPress={onClose}
                />

                <View
                    testID="rating-modal-card-wrapper"
                    style={[
                        styles.modalCardWrapper,
                        isKeyboardVisible && styles.modalCardWrapperKeyboardOpen,
                    ]}
                >
                    <SafeAreaView
                        testID="rating-modal-safe-area"
                        edges={isKeyboardVisible ? [] : ["bottom"]}
                        style={[
                            styles.modalCard,
                            !isKeyboardVisible && styles.modalCardFull,
                        ]}
                    >
                        <Pressable onPress={Keyboard.dismiss} style={styles.handleBarTouch}>
                            <View style={styles.handleBar}/>
                        </Pressable>

                        <View style={[styles.header, styles.divider]}/>

                        <ScrollView
                            ref={scrollViewRef}
                            style={styles.scrollBody}
                            contentContainerStyle={[
                                styles.scrollContent,
                                isKeyboardVisible && styles.scrollContentKeyboardOpen,
                            ]}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                            showsVerticalScrollIndicator={false}
                        >
                            <Pressable onPress={Keyboard.dismiss} style={styles.profileSection}>
                                <View style={styles.profileContainer}>
                                    <View style={styles.arrowContainer} pointerEvents="none">
                                        <View style={styles.arrowPointer}/>
                                    </View>
                                    <Avatar
                                        imageUrl={avatarUrl}
                                        avatarSize={isKeyboardVisible ? 33 : 44}
                                        avatarBorderRadius={isKeyboardVisible ? 22 : 32}
                                        avatarBorderWidth={2}
                                        avatarBorderColor="red"
                                    />
                                    <Text style={styles.profileName}>{mechanicName}</Text>
                                </View>

                                <Text style={styles.mechanicName}>Thank you!</Text>
                                {!isKeyboardVisible && (
                                    <Text style={styles.serviceSubtitle}>Please rate your trip</Text>
                                )}
                            </Pressable>

                            <View style={[styles.ratingSection, isKeyboardVisible && styles.ratingSectionCompact]}>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Button
                                            key={star}
                                            testID={`rating-star-${star}`}
                                            variant="ghost"
                                            size="custom"
                                            activeOpacity={0.7}
                                            onPress={() => setSelectedStars(star)}
                                            style={styles.starButton}
                                            accessibilityLabel={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                            icon={
                                                <Ionicons
                                                    name="star"
                                                    size={isKeyboardVisible ? 22 : 28}
                                                    color={star <= selectedStars ? "#FFB800" : "rgba(184,186,191,0.63)"}
                                                />
                                            }
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.commentSection}>
                                <Text style={styles.sectionHeading}>{mechanicName}!</Text>
                                <TextInput
                                    testID="rating-comment-input"
                                    style={[
                                        styles.commentInput,
                                        isKeyboardVisible && styles.commentInputCompact,
                                    ]}
                                    placeholder="Write your message here ..."
                                    placeholderTextColor="#64748B"
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                    numberOfLines={isKeyboardVisible ? 3 : 4}
                                    textAlignVertical="top"
                                />
                            </View>

                            <Button
                                testID="rating-submit-button"
                                title="Confirm"
                                variant="primary"
                                onPress={handleSubmit}
                                style={[
                                    styles.submitButton,
                                    isKeyboardVisible && styles.submitButtonCompact,
                                ]}
                            />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        justifyContent: "flex-end",
    },
    dismissArea: {
        flex: 1,
    },
    modalCardWrapper: {
        width: "100%",
        height: MODAL_HEIGHT,
        maxHeight: "100%",
    },
    modalCardWrapperKeyboardOpen: {
        height: "auto",
    },
    modalCard: {
        backgroundColor: "#121820",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        width: "100%",
    },
    modalCardFull: {
        height: "100%",
    },
    handleBarTouch: {
        width: "100%",
        paddingTop: 10,
        paddingBottom: 6,
        alignItems: "center",
    },
    handleBar: {
        width: 42,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    header: {
        flex: 1,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    scrollBody: {
        flexShrink: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    scrollContentKeyboardOpen: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    profileSection: {
        alignItems: "center",
        width: "100%",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 40,
        marginBottom: 30,
        gap: 12,
    },
    arrowContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -6,
        alignItems: "center",
        justifyContent: "center",
    },
    arrowPointer: {
        backgroundColor: "#fff",
        borderRadius: 4,
        width: 20,
        height: 20,
        transform: [{rotate: "45deg"}],
    },
    profileName: {
        fontWeight: "bold",
    },
    mechanicName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    serviceSubtitle: {
        fontSize: 13,
        color: "#94A3B8",
        textAlign: "center",
    },
    ratingSection: {
        alignItems: "center",
    },
    ratingSectionCompact: {},
    starsRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    starButton: {
        padding: 3,
    },
    commentSection: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 14,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: "600",
        padding: 10,
        color: "#fff",
        marginBottom: 2,
    },
    commentInput: {
        minHeight: 100,
        color: "#dedede",
        fontSize: 14,
        padding: 12,
    },
    commentInputCompact: {
        minHeight: 90,
        padding: 10,
    },
    submitButton: {
        alignSelf: "center",
        width: "60%",
        borderRadius: 50,
        marginTop: 10,
    },
    submitButtonCompact: {
        marginVertical: 4,
    },
});

export default RatingModal;