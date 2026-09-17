import React, {useEffect, useState, useRef, useMemo} from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@react-native-vector-icons/ionicons";
import {useAuth} from "@/hooks/useAuth";
import {Avatar, Button} from "@/components/ui";
import {
    buildChatId,
    subscribeToMessages,
    sendMessage,
    markChatAsRead,
    getOrCreateConversation,
    formatMessageTime,
} from "@/services/chatService";
import {ChatMessage, ChatParticipant} from "@/types/chat";
import CustomHeader from "@/components/navigations/CustomHeader";

const QUICK_SUGGESTIONS = [
    "What is your estimated arrival time?",
    "How much will the diagnostics cost?",
    "My car is making a strange sound.",
    "I'm at the location waiting.",
];

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const {user, userProfile} = useAuth();
    const params = useLocalSearchParams<{
        chatId?: string;
        mechanicId: string;
        mechanicName?: string;
        mechanicAvatar?: string;
        mechanicPhone?: string;
        mechanicRole?: string;
        mechanicRating?: string;
    }>();

    const flatListRef = useRef<FlatList>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const currentUserId = user?.uid || "guest_user";
    const mechanicId = params.mechanicId || "mechanic_default";
    const mechanicName = params.mechanicName || "Assigned Mechanic";
    const mechanicAvatar = params.mechanicAvatar || undefined;
    const mechanicPhone = params.mechanicPhone || "";
    const mechanicRating = params.mechanicRating ? parseFloat(params.mechanicRating) : 4.9;

    // Deterministic conversation ID
    const resolvedChatId = useMemo(() => {
        if (params.chatId) return params.chatId;
        return buildChatId(currentUserId, mechanicId);
    }, [params.chatId, currentUserId, mechanicId]);

    const currentUserParticipant: ChatParticipant = useMemo(() => ({
        id: currentUserId,
        name: userProfile?.fullName || userProfile?.username || user?.displayName || "Customer",
        avatar: userProfile?.profileImage || user?.photoURL || undefined,
        role: userProfile?.role || "customer",
    }), [currentUserId, userProfile, user]);

    const mechanicParticipant: ChatParticipant = useMemo(() => ({
        id: mechanicId,
        name: mechanicName,
        avatar: mechanicAvatar,
        role: params.mechanicRole || "mechanic",
        phone: mechanicPhone,
        rating: mechanicRating,
    }), [mechanicId, mechanicName, mechanicAvatar, params.mechanicRole, mechanicPhone, mechanicRating]);

    // 1. Initialize conversation and mark messages as read
    useEffect(() => {
        if (!resolvedChatId) return;

        getOrCreateConversation(currentUserParticipant, mechanicParticipant).catch((err) => {
            console.warn("[ChatScreen] Error getting or creating conversation:", err);
        });

        markChatAsRead(resolvedChatId, currentUserId);
    }, [resolvedChatId, currentUserParticipant, mechanicParticipant, currentUserId]);

    // 2. Real-time Firestore subscription to messages
    useEffect(() => {
        if (!resolvedChatId) {
            setIsLoadingHistory(false);
            return;
        }

        setIsLoadingHistory(true);
        const unsubscribe = subscribeToMessages(
            resolvedChatId,
            (newMessages) => {
                setMessages(newMessages);
                setIsLoadingHistory(false);
                markChatAsRead(resolvedChatId, currentUserId);
            },
            (error) => {
                console.warn("[ChatScreen] subscribeToMessages error:", error);
                setIsLoadingHistory(false);
            }
        );

        return () => unsubscribe();
    }, [resolvedChatId, currentUserId]);

    // Auto-scroll when messages update
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({animated: true});
            }, 100);
        }
    }, [messages.length]);

    // 3. Send a message
    const handleSend = async (textToSend?: string) => {
        const text = (textToSend || inputText).trim();
        if (!text || isSending) return;

        setInputText("");
        setIsSending(true);

        try {
            await sendMessage(
                resolvedChatId,
                currentUserParticipant,
                mechanicParticipant,
                text
            );
        } catch (error) {
            console.error("[ChatScreen] Error sending message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const renderMessageItem = ({item}: { item: ChatMessage }) => {
        const isFromMe = item.senderId === currentUserId;
        const timeFormatted = formatMessageTime(item.createdAt);

        return (
            <View
                style={[
                    styles.messageRow,
                    isFromMe ? styles.messageRowRight : styles.messageRowLeft,
                ]}
            >
                {!isFromMe && (
                    <Avatar
                        imageUrl={item.senderAvatar || mechanicAvatar}
                        avatarSize={32}
                        avatarBorderRadius={16}
                        avatarBackgroundColor="#1e293b"
                        style={styles.senderAvatar}
                    />
                )}

                <View
                    style={[
                        styles.messageBubble,
                        isFromMe ? styles.bubbleOutgoing : styles.bubbleIncoming,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isFromMe ? styles.textOutgoing : styles.textIncoming,
                        ]}
                    >
                        {item.text}
                    </Text>

                    <View style={styles.messageFooter}>
                        <Text
                            style={[
                                styles.timeText,
                                isFromMe ? styles.timeOutgoing : styles.timeIncoming,
                            ]}
                        >
                            {timeFormatted}
                        </Text>
                        {isFromMe && (
                            <Ionicons
                                name={item.read ? "checkmark-done" : "checkmark"}
                                size={14}
                                color={item.read ? "#93c5fd" : "rgba(255, 255, 255, 0.6)"}
                                style={styles.statusCheck}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : insets.top}
        >
            <CustomHeader
                showBackButton={true}
                rightAction={
                    <Button
                        type="ghost"
                        size="custom"
                        onPress={() => console.log("View Mechanic")}
                        style={styles.backButton}
                        accessibilityLabel="View profile"
                        icon={<Ionicons name="ellipsis-vertical" size={24} color="#ffffff"/>}
                    />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Avatar
                            imageUrl={mechanicAvatar}
                            avatarSize={40}
                            avatarBorderRadius={20}
                            avatarBackgroundColor="#1e293b"
                        />
                        <View style={styles.headerOnlineDot}/>
                    </View>
                    <View>
                        <Text style={styles.headerName} numberOfLines={1}>
                            {mechanicName}
                        </Text>
                        <Text style={{color: "#fff"}}>Online</Text>
                    </View>
                </View>
            </CustomHeader>

            {/* Chat Body */}
            {isLoadingHistory ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0094ff"/>
                    <Text style={styles.loadingText}>Loading chat history...</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    style={{ flex: 1 }}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessageItem}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.welcomeCard}>
                                <Avatar
                                    imageUrl={mechanicAvatar}
                                    avatarSize={64}
                                    avatarBorderRadius={32}
                                    avatarBackgroundColor="#1e293b"
                                />
                                <Text style={styles.welcomeTitle}>
                                    Chat with {mechanicName}
                                </Text>
                                <Text style={styles.welcomeSubtitle}>
                                    Ask questions about diagnostics, arrival times, repair procedures, or cost
                                    estimates.
                                </Text>
                            </View>

                            <Text style={styles.suggestionsHeader}>Quick questions:</Text>
                            <View style={styles.suggestionsContainer}>
                                {QUICK_SUGGESTIONS.map((suggestion, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.suggestionChip}
                                        onPress={() => handleSend(suggestion)}
                                    >
                                        <Ionicons name="chatbubble-outline" size={13} color="#0094ff"/>
                                        <Text style={styles.suggestionText}>{suggestion}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    }
                />
            )}

            {/* Bottom Message Input Bar */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#64748b"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={1000}
                />

                <Pressable
                    style={[
                        styles.sendButton,
                        (!inputText.trim() || isSending) ? styles.sendButtonDisabled : styles.sendButtonActive,
                    ]}
                    onPress={() => handleSend()}
                    disabled={!inputText.trim() || isSending}
                    accessibilityLabel="Send message"
                >
                    {isSending ? (
                        <ActivityIndicator size="small" color="#ffffff"/>
                    ) : (
                        <Ionicons name="send" size={18} color="#ffffff" style={styles.sendIcon}/>
                    )}
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    header: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        gap: 12,
        paddingVertical: 12,
        borderBottomColor: "rgba(255, 255, 255, 0.08)",
    },
    backButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 4,
    },
    headerOnlineDot: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#10b981",
        borderWidth: 1.5,
        borderColor: "#16202c",
    },
    headerName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
    headerRatingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 1,
    },
    headerRatingText: {
        fontSize: 11,
        color: "#94a3b8",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 148, 255, 0.12)",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    loadingText: {
        color: "#94a3b8",
        fontSize: 14,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 2,
    },
    messageRowLeft: {
        justifyContent: "flex-start",
    },
    messageRowRight: {
        justifyContent: "flex-end",
    },
    senderAvatar: {
        marginRight: 8,
        marginBottom: 2,
    },
    messageBubble: {
        maxWidth: "78%",
        paddingHorizontal: 14,
        paddingTop: 10,
        paddingBottom: 8,
        borderRadius: 18,
    },
    bubbleOutgoing: {
        backgroundColor: "#0094ff",
        borderBottomRightRadius: 4,
    },
    bubbleIncoming: {
        backgroundColor: "#1e2837",
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.06)",
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    textOutgoing: {
        color: "#ffffff",
    },
    textIncoming: {
        color: "#f1f5f9",
    },
    messageFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 4,
        marginTop: 4,
    },
    timeText: {
        fontSize: 10,
    },
    timeOutgoing: {
        color: "rgba(255, 255, 255, 0.75)",
    },
    timeIncoming: {
        color: "#94a3b8",
    },
    statusCheck: {
        marginLeft: 2,
    },
    // Empty state & Suggestions
    emptyContainer: {
        paddingVertical: 24,
        alignItems: "center",
    },
    welcomeCard: {
        alignItems: "center",
        backgroundColor: "#16202c",
        padding: 24,
        borderRadius: 20,
        width: "100%",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.06)",
        gap: 10,
        marginBottom: 24,
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    welcomeSubtitle: {
        fontSize: 13,
        color: "#94a3b8",
        textAlign: "center",
        lineHeight: 18,
    },
    suggestionsHeader: {
        alignSelf: "flex-start",
        fontSize: 13,
        fontWeight: "600",
        color: "#64748b",
        marginBottom: 10,
    },
    suggestionsContainer: {
        width: "100%",
        gap: 8,
    },
    suggestionChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#17212e",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 148, 255, 0.2)",
    },
    suggestionText: {
        color: "#e2e8f0",
        fontSize: 13,
    },
    // Bottom input bar
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#16202c",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.08)",
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: "#0d131a",
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: "#ffffff",
        fontSize: 14,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.06)",
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonActive: {
        backgroundColor: "#0094ff",
    },
    sendButtonDisabled: {
        backgroundColor: "#1e293b",
    },
    sendIcon: {
        marginLeft: 2,
    },
});
