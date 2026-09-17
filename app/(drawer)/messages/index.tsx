import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
    TextInput,
    Modal,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useAuth } from "@/hooks/useAuth";
import CustomHeader from "@/components/navigations/CustomHeader";
import { Avatar, Button, Rating } from "@/components/ui";
import {
    subscribeToConversations,
    getOrCreateConversation,
    getAvailableMechanics,
    formatMessageTime,
    buildChatId,
} from "@/services/chatService";
import {
    getFcmToken,
    requestNotificationPermission,
    saveFcmTokenToUser,
    setupForegroundMessageListener,
} from "@/services/fcmService";
import { ChatConversation, ChatParticipant } from "@/types/chat";
import {SafeAreaView} from "react-native-safe-area-context";

export default function MessagesScreen() {
    const router = useRouter();
    const { user, userProfile } = useAuth();

    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // New Chat Modal state
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [mechanicsList, setMechanicsList] = useState<ChatParticipant[]>([]);
    const [mechanicsSearch, setMechanicsSearch] = useState("");
    const [isLoadingMechanics, setIsLoadingMechanics] = useState(false);

    const currentUserId = user?.uid || "guest_user";
    const currentParticipant: ChatParticipant = useMemo(() => ({
        id: currentUserId,
        name: userProfile?.fullName || userProfile?.username || user?.displayName || "Customer",
        avatar: userProfile?.profileImage || user?.photoURL || undefined,
        role: userProfile?.role || "customer",
    }), [currentUserId, userProfile, user]);

    // 1. Setup real FCM token & foreground push listener in background
    useEffect(() => {
        let isMounted = true;

        const initNotifications = async () => {
            const hasPermission = await requestNotificationPermission();
            if (hasPermission) {
                const token = await getFcmToken();
                if (token && isMounted && user?.uid) {
                    await saveFcmTokenToUser(user.uid, token);
                }
            }
        };

        initNotifications();

        const unsubscribeForeground = setupForegroundMessageListener((remoteMessage) => {
            console.log("[MessagesScreen] Push notification received in foreground:", remoteMessage);
        });

        return () => {
            isMounted = false;
            if (unsubscribeForeground) unsubscribeForeground();
        };
    }, [user?.uid]);

    // 2. Subscribe to real-time conversations from Firestore
    useEffect(() => {
        if (!currentUserId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = subscribeToConversations(
            currentUserId,
            (updatedList) => {
                setConversations(updatedList);
                setIsLoading(false);
                setRefreshing(false);
            },
            (error) => {
                console.warn("[MessagesScreen] Firestore subscription error:", error);
                setIsLoading(false);
                setRefreshing(false);
            }
        );

        return () => unsubscribe();
    }, [currentUserId]);

    // 3. Load available mechanics when New Chat modal opens
    const handleOpenNewChat = async () => {
        setShowNewChatModal(true);
        setIsLoadingMechanics(true);
        try {
            const mechanics = await getAvailableMechanics();
            setMechanicsList(mechanics);
        } catch (err) {
            console.warn("[MessagesScreen] Failed to load mechanics:", err);
        } finally {
            setIsLoadingMechanics(false);
        }
    };

    // Filter conversations by search
    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const q = searchQuery.toLowerCase().trim();
        return conversations.filter((c) => {
            const otherParticipantId = c.participants.find((p) => p !== currentUserId);
            const otherUser = otherParticipantId ? c.participantDetails?.[otherParticipantId] : null;
            const name = otherUser?.name?.toLowerCase() || "";
            const lastMsg = c.lastMessage?.text?.toLowerCase() || "";
            return name.includes(q) || lastMsg.includes(q);
        });
    }, [conversations, searchQuery, currentUserId]);

    // Filter mechanics in New Chat modal
    const filteredMechanics = useMemo(() => {
        if (!mechanicsSearch.trim()) return mechanicsList;
        const q = mechanicsSearch.toLowerCase().trim();
        return mechanicsList.filter(
            (m) =>
                m.name.toLowerCase().includes(q) ||
                m.expertise?.some((e) => e.toLowerCase().includes(q)) ||
                m.phone?.includes(q)
        );
    }, [mechanicsList, mechanicsSearch]);

    // Start or open a chat with a mechanic
    const handleSelectMechanic = async (mechanic: ChatParticipant) => {
        setShowNewChatModal(false);
        try {
            await getOrCreateConversation(currentParticipant, mechanic);
            const chatId = buildChatId(currentParticipant.id, mechanic.id);
            router.push({
                pathname: "/(drawer)/messages/chat",
                params: {
                    chatId,
                    mechanicId: mechanic.id,
                    mechanicName: mechanic.name,
                    mechanicAvatar: mechanic.avatar || "",
                    mechanicPhone: mechanic.phone || "",
                    mechanicRole: mechanic.role || "mechanic",
                    mechanicRating: mechanic.rating ? String(mechanic.rating) : "4.9",
                },
            });
        } catch (err) {
            console.error("[MessagesScreen] Error opening chat:", err);
        }
    };

    const handleOpenConversation = (conversation: ChatConversation) => {
        const otherParticipantId = conversation.participants.find((p) => p !== currentUserId);
        const otherUser = otherParticipantId ? conversation.participantDetails?.[otherParticipantId] : null;

        router.push({
            pathname: "/(drawer)/messages/chat",
            params: {
                chatId: conversation.id,
                mechanicId: otherUser?.id || otherParticipantId || "",
                mechanicName: otherUser?.name || "Mechanic",
                mechanicAvatar: otherUser?.avatar || "",
                mechanicPhone: otherUser?.phone || "",
                mechanicRole: otherUser?.role || "mechanic",
                mechanicRating: otherUser?.rating ? String(otherUser.rating) : "4.9",
            },
        });
    };

    const renderConversationItem = ({ item }: { item: ChatConversation }) => {
        const otherParticipantId = item.participants.find((p) => p !== currentUserId);
        const otherUser = otherParticipantId ? item.participantDetails?.[otherParticipantId] : null;
        const displayName = otherUser?.name || "Mechanic";
        const avatarUrl = otherUser?.avatar;
        const lastMsgText = item.lastMessage?.text || "Started conversation";
        const timeText = item.lastMessage?.createdAt
            ? formatMessageTime(item.lastMessage.createdAt)
            : formatMessageTime(item.updatedAt || item.createdAt);
        const unreadCount = item.unreadCount?.[currentUserId] || 0;
        const isFromMe = item.lastMessage?.senderId === currentUserId;

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.conversationCard,
                    pressed && styles.conversationCardPressed,
                ]}
                onPress={() => handleOpenConversation(item)}
            >
                {/* Avatar with Online Status Indicator */}
                <View style={styles.avatarContainer}>
                    <Avatar
                        imageUrl={avatarUrl}
                        avatarSize={52}
                        avatarBorderRadius={26}
                        avatarBackgroundColor="#1e293b"
                    />
                    <View style={styles.onlineDot} />
                </View>

                {/* Content */}
                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeaderRow}>
                        <Text style={styles.mechanicName} numberOfLines={1}>
                            {displayName}
                        </Text>
                        <Text style={styles.timestampText}>{timeText}</Text>
                    </View>

                    {otherUser?.expertise && otherUser.expertise.length > 0 && (
                        <Text style={styles.expertiseSnippet} numberOfLines={1}>
                            {otherUser.expertise.slice(0, 2).join(", ")}
                        </Text>
                    )}

                    <View style={styles.snippetRow}>
                        {isFromMe && (
                            <Ionicons
                                name={item.lastMessage?.read ? "checkmark-done" : "checkmark"}
                                size={15}
                                color={item.lastMessage?.read ? "#0094ff" : "#94a3b8"}
                                style={styles.checkIcon}
                            />
                        )}
                        <Text
                            style={[
                                styles.messageSnippet,
                                unreadCount > 0 && styles.messageSnippetUnread,
                            ]}
                            numberOfLines={1}
                        >
                            {lastMsgText}
                        </Text>

                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}><CustomHeader
                title="Messages"
                showMenuButton={true}
            />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search conversations or mechanics..."
                    placeholderTextColor="#64748b"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                    <Pressable onPress={() => setSearchQuery("")} style={styles.clearSearchBtn}>
                        <Ionicons name="close-circle" size={18} color="#94a3b8" />
                    </Pressable>
                )}
            </View>

            {/* Conversations List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0094ff" />
                    <Text style={styles.loadingText}>Loading conversations...</Text>
                </View>
            ) : filteredConversations.length > 0 ? (
                <FlatList
                    data={filteredConversations}
                    keyExtractor={(item) => item.id}
                    renderItem={renderConversationItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => setRefreshing(true)}
                            tintColor="#0094ff"
                            colors={["#0094ff"]}
                        />
                    }
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="chatbubbles-outline" size={44} color="#0094ff" />
                    </View>
                    <Text style={styles.emptyTitle}>
                        {searchQuery ? "No matches found" : "No Conversations Yet"}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        {searchQuery
                            ? "Try searching for a different name or message phrase."
                            : "Connect directly with experienced mechanics to ask questions, check repair status, or get quotes."}
                    </Text>
                    <Button
                        title="Start a New Chat"
                        variant="primary"
                        icon={<Ionicons name="chatbubble-ellipses-outline" size={18} color="#ffffff" />}
                        onPress={handleOpenNewChat}
                        style={styles.startChatBtn}
                    />
                </View>
            )}

            {/* Floating Action Button for New Chat */}
            <Pressable
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
                onPress={handleOpenNewChat}
                accessibilityLabel="Start New Chat"
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="#ffffff" />
            </Pressable>

            {/* Modal 1: New Chat Selection */}
            <Modal
                visible={showNewChatModal}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowNewChatModal(false)}
            >
                <SafeAreaView edges={["top"]} style={styles.modalContainer}>
                    <CustomHeader
                        title="Start New Chat"
                        showBackButton={true}
                        showMenuButton={false}
                        onBackPress={() => setShowNewChatModal(false)}
                        rightAction={
                            <Button
                                type="ghost"
                                size="custom"
                                onPress={() => setShowNewChatModal(false)}
                                style={styles.headerIconButton}
                                icon={<Ionicons name="close" size={24} color="#ffffff" />}
                            />
                        }
                    />

                    {/* Mechanics Search */}
                    <View style={styles.modalSearchContainer}>
                        <Ionicons name="search" size={18} color="#64748b" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by mechanic name or specialty..."
                            placeholderTextColor="#64748b"
                            value={mechanicsSearch}
                            onChangeText={setMechanicsSearch}
                            clearButtonMode="while-editing"
                            autoFocus={false}
                        />
                    </View>

                    {isLoadingMechanics ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#0094ff" />
                            <Text style={styles.loadingText}>Fetching available mechanics...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredMechanics}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.mechanicsListContent}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.mechanicCard,
                                        pressed && styles.mechanicCardPressed,
                                    ]}
                                    onPress={() => handleSelectMechanic(item)}
                                >
                                    <View style={styles.avatarContainer}>
                                        <Avatar
                                            imageUrl={item.avatar}
                                            avatarSize={56}
                                            avatarBorderRadius={28}
                                            avatarBackgroundColor="#1e293b"
                                        />
                                        <View style={styles.onlineDot} />
                                    </View>

                                    <View style={styles.mechanicDetails}>
                                        <View style={styles.mechanicNameRow}>
                                            <Text style={styles.mechanicCardName} numberOfLines={1}>
                                                {item.name}
                                            </Text>
                                            {item.rating && (
                                                <Rating value={item.rating} size={13} showValue={false} />
                                            )}
                                        </View>

                                        <Text style={styles.mechanicSpecialty} numberOfLines={1}>
                                            {item.expertise && item.expertise.length > 0
                                                ? item.expertise.join(", ")
                                                : "Certified Auto Mechanic"}
                                        </Text>

                                        {item.phone && (
                                            <Text style={styles.mechanicPhoneText} numberOfLines={1}>
                                                +{item.phone}
                                            </Text>
                                        )}
                                    </View>

                                    <Button
                                        title="Chat"
                                        variant="primary"
                                        size="sm"
                                        onPress={() => handleSelectMechanic(item)}
                                        icon={<Ionicons name="chatbubble-outline" size={15} color="#fff" />}
                                        style={styles.chatActionBtn}
                                    />
                                </Pressable>
                            )}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    headerIconButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1b2431",
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.06)",
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: "#ffffff",
        fontSize: 14,
    },
    clearSearchBtn: {
        padding: 4,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 80,
        gap: 10,
    },
    conversationCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#171f2a",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    conversationCardPressed: {
        backgroundColor: "#1f2937",
    },
    avatarContainer: {
        position: "relative",
        marginRight: 14,
    },
    onlineDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#10b981",
        borderWidth: 2,
        borderColor: "#0f151d",
    },
    conversationContent: {
        flex: 1,
        justifyContent: "center",
    },
    conversationHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 2,
    },
    mechanicName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
        flex: 1,
        marginRight: 8,
    },
    timestampText: {
        fontSize: 11,
        color: "#64748b",
    },
    expertiseSnippet: {
        fontSize: 12,
        color: "#0094ff",
        marginBottom: 4,
    },
    snippetRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkIcon: {
        marginRight: 4,
    },
    messageSnippet: {
        flex: 1,
        fontSize: 13,
        color: "#94a3b8",
    },
    messageSnippetUnread: {
        color: "#f1f5f9",
        fontWeight: "600",
    },
    unreadBadge: {
        backgroundColor: "#0094ff",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        marginLeft: 8,
    },
    unreadBadgeText: {
        color: "#ffffff",
        fontSize: 11,
        fontWeight: "700",
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
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        gap: 12,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(0, 148, 255, 0.12)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#94a3b8",
        textAlign: "center",
        lineHeight: 19,
        marginBottom: 8,
    },
    startChatBtn: {
        minWidth: 180,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#0094ff",
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#0094ff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    fabPressed: {
        backgroundColor: "#007acc",
        transform: [{ scale: 0.95 }],
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: "#0f151d",
    },
    modalSearchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1b2431",
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 44,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.06)",
    },
    mechanicsListContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        gap: 12,
    },
    mechanicCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#171f2a",
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    mechanicCardPressed: {
        backgroundColor: "#1e2837",
    },
    mechanicDetails: {
        flex: 1,
        marginRight: 10,
    },
    mechanicNameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
    },
    mechanicCardName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#ffffff",
        flex: 1,
        marginRight: 8,
    },
    mechanicSpecialty: {
        fontSize: 12,
        color: "#94a3b8",
        marginBottom: 2,
    },
    mechanicPhoneText: {
        fontSize: 11,
        color: "#64748b",
    },
    chatActionBtn: {
        minWidth: 72,
    },
});