import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    limit,
    writeBatch,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { ChatConversation, ChatMessage, ChatParticipant } from "@/types/chat";
import { MOCK_MECHANICS } from "@/constants/mechanics";
import type { Mechanic } from "@/types/mechanic";

/**
 * Builds a deterministic conversation ID based on two user IDs.
 */
export function buildChatId(userId1: string, userId2: string): string {
    const clean1 = String(userId1).trim();
    const clean2 = String(userId2).trim();
    return [clean1, clean2].sort().join("_");
}

/**
 * Safely parse timestamps into a JS Date
 */
export function parseDate(value: any): Date {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    if (typeof value.toDate === "function") return value.toDate();
    if (typeof value === "number") return new Date(value);
    if (typeof value === "string") {
        const parsed = new Date(value);
        if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
}

/**
 * Formats a message timestamp into human readable time
 */
export function formatMessageTime(dateVal: any): string {
    const date = parseDate(dateVal);
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

    if (isToday) {
        return timeStr;
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
        return `Yesterday, ${timeStr}`;
    }

    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • ${timeStr}`;
}

/**
 * Get or create a conversation between current user and a mechanic/user
 */
export async function getOrCreateConversation(
    currentUser: ChatParticipant,
    otherUser: ChatParticipant
): Promise<ChatConversation> {
    const chatId = buildChatId(currentUser.id, otherUser.id);
    const chatDocRef = doc(db, "chats", chatId);

    const snapshot = await getDoc(chatDocRef);
    if (snapshot.exists()) {
        const data = snapshot.data() as ChatConversation;
        // Ensure participantDetails is up to date
        const updatedDetails = {
            ...(data.participantDetails || {}),
            [currentUser.id]: {
                ...(data.participantDetails?.[currentUser.id] || {}),
                ...currentUser,
            },
            [otherUser.id]: {
                ...(data.participantDetails?.[otherUser.id] || {}),
                ...otherUser,
            },
        };
        await updateDoc(chatDocRef, {
            participantDetails: updatedDetails,
        }).catch(() => {});

        return {
            ...data,
            id: chatId,
            participantDetails: updatedDetails,
        };
    }

    const newConversation: ChatConversation = {
        id: chatId,
        participants: [currentUser.id, otherUser.id],
        participantDetails: {
            [currentUser.id]: currentUser,
            [otherUser.id]: otherUser,
        },
        unreadCount: {
            [currentUser.id]: 0,
            [otherUser.id]: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    await setDoc(chatDocRef, newConversation);
    return newConversation;
}

/**
 * Real-time subscription to user's conversations
 */
export function subscribeToConversations(
    userId: string,
    onUpdate: (conversations: ChatConversation[]) => void,
    onError?: (error: any) => void
): () => void {
    if (!userId) {
        onUpdate([]);
        return () => {};
    }

    const chatsRef = collection(db, "chats");
    // Filter by participants containing current userId
    const q = query(chatsRef, where("participants", "array-contains", userId));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const conversations: ChatConversation[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as ChatConversation;
                conversations.push({
                    ...data,
                    id: docSnap.id,
                });
            });

            // Sort in-memory by updatedAt descending (avoids needing a Firestore composite index)
            conversations.sort((a, b) => {
                const dateA = parseDate(a.updatedAt || a.createdAt).getTime();
                const dateB = parseDate(b.updatedAt || b.createdAt).getTime();
                return dateB - dateA;
            });

            onUpdate(conversations);
        },
        (err) => {
            console.warn("[ChatService] subscribeToConversations error:", err);
            if (onError) onError(err);
        }
    );

    return unsubscribe;
}

/**
 * Real-time subscription to messages within a conversation
 */
export function subscribeToMessages(
    chatId: string,
    onUpdate: (messages: ChatMessage[]) => void,
    onError?: (error: any) => void
): () => void {
    if (!chatId) {
        onUpdate([]);
        return () => {};
    }

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const messages: ChatMessage[] = [];
            snapshot.forEach((docSnap) => {
                const data = docSnap.data() as Omit<ChatMessage, "id">;
                messages.push({
                    ...data,
                    id: docSnap.id,
                });
            });
            onUpdate(messages);
        },
        (err) => {
            console.warn("[ChatService] subscribeToMessages error:", err);
            if (onError) onError(err);
        }
    );

    return unsubscribe;
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
    chatId: string,
    sender: ChatParticipant,
    receiver: ChatParticipant,
    text: string
): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) return "";

    const messagesRef = collection(db, "chats", chatId, "messages");
    const chatDocRef = doc(db, "chats", chatId);

    // 1. Add message doc
    const messageData = {
        chatId,
        senderId: sender.id,
        senderName: sender.name,
        senderAvatar: sender.avatar || "",
        receiverId: receiver.id,
        receiverName: receiver.name,
        text: trimmed,
        createdAt: serverTimestamp(),
        read: false,
        status: "sent",
    };

    const newDoc = await addDoc(messagesRef, messageData);

    // 2. Fetch current conversation to update unread counts
    const chatSnap = await getDoc(chatDocRef);
    const existingUnread = chatSnap.exists() ? (chatSnap.data().unreadCount || {}) : {};
    const receiverUnread = (existingUnread[receiver.id] || 0) + 1;

    await updateDoc(chatDocRef, {
        lastMessage: {
            text: trimmed,
            senderId: sender.id,
            senderName: sender.name,
            createdAt: serverTimestamp(),
            read: false,
        },
        updatedAt: serverTimestamp(),
        participantDetails: {
            [sender.id]: sender,
            [receiver.id]: receiver,
        },
        [`unreadCount.${receiver.id}`]: receiverUnread,
        [`unreadCount.${sender.id}`]: 0,
    }).catch(async () => {
        // If updateDoc fails because doc wasn't created
        await setDoc(chatDocRef, {
            id: chatId,
            participants: [sender.id, receiver.id],
            participantDetails: {
                [sender.id]: sender,
                [receiver.id]: receiver,
            },
            lastMessage: {
                text: trimmed,
                senderId: sender.id,
                senderName: sender.name,
                createdAt: serverTimestamp(),
                read: false,
            },
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
            unreadCount: {
                [receiver.id]: receiverUnread,
                [sender.id]: 0,
            },
        }, { merge: true });
    });

    // 3. Automated reply handler for catalog mechanics (Joe Doe, Marcus Vance, etc.)
    const isMockMechanic = MOCK_MECHANICS.some((m) => String(m.id) === String(receiver.id));
    if (isMockMechanic) {
        triggerSimulatedMechanicReply(chatId, receiver, sender, trimmed);
    }

    return newDoc.id;
}

/**
 * Intelligent simulated replies from platform mechanics to provide a rich demo experience
 */
const MECHANIC_REPLIES = [
    "Hello! I received your message. I'm reviewing the vehicle details now.",
    "On my way! I should arrive in about 10-15 minutes.",
    "Got it! I have the diagnostic equipment ready for inspection.",
    "Thanks for letting me know. Let me run a quick system check when I arrive.",
    "Understood. If you notice any fluid leaks or warning lights on the dashboard, please let me know.",
    "I'm finishing up a nearby service and will head straight to your location.",
];

function triggerSimulatedMechanicReply(
    chatId: string,
    mechanic: ChatParticipant,
    customer: ChatParticipant,
    customerMessage: string
) {
    const lower = customerMessage.toLowerCase();
    let replyText = MECHANIC_REPLIES[Math.floor(Math.random() * MECHANIC_REPLIES.length)];

    if (lower.includes("where") || lower.includes("eta") || lower.includes("time") || lower.includes("arrive")) {
        replyText = "I'm currently on my way! My ETA is around 10-15 minutes depending on traffic.";
    } else if (lower.includes("cost") || lower.includes("price") || lower.includes("fee") || lower.includes("quote")) {
        replyText = `My initial consultation fee is $${mechanic.rating ? "25" : "20"}, and flat diagnostics fee is $${mechanic.rating ? "65" : "50"}. Any parts needed will be quoted upfront.`;
    } else if (lower.includes("brake") || lower.includes("noise") || lower.includes("sound") || lower.includes("oil")) {
        replyText = "That sounds like something we should inspect immediately. Please avoid heavy driving until I arrive to check it.";
    } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        replyText = `Hello! I'm ${mechanic.name}. How can I assist you with your vehicle today?`;
    } else if (lower.includes("thank") || lower.includes("thanks")) {
        replyText = "You're very welcome! Drive safe and feel free to reach out anytime.";
    }

    // Delay 1.5s for realistic conversation flow
    setTimeout(async () => {
        try {
            const messagesRef = collection(db, "chats", chatId, "messages");
            const chatDocRef = doc(db, "chats", chatId);

            await addDoc(messagesRef, {
                chatId,
                senderId: mechanic.id,
                senderName: mechanic.name,
                senderAvatar: mechanic.avatar || "",
                receiverId: customer.id,
                receiverName: customer.name,
                text: replyText,
                createdAt: serverTimestamp(),
                read: false,
                status: "delivered",
            });

            await updateDoc(chatDocRef, {
                lastMessage: {
                    text: replyText,
                    senderId: mechanic.id,
                    senderName: mechanic.name,
                    createdAt: serverTimestamp(),
                    read: false,
                },
                updatedAt: serverTimestamp(),
                [`unreadCount.${customer.id}`]: 1,
            });
        } catch (err) {
            console.log("[ChatService] Error sending simulated mechanic reply:", err);
        }
    }, 1500);
}

/**
 * Mark a conversation's messages as read
 */
export async function markChatAsRead(chatId: string, currentUserId: string): Promise<void> {
    if (!chatId || !currentUserId) return;
    try {
        const chatDocRef = doc(db, "chats", chatId);

        // Reset unread count for current user
        await updateDoc(chatDocRef, {
            [`unreadCount.${currentUserId}`]: 0,
        }).catch(() => {});

        // Mark unread messages where receiver is current user
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(
            messagesRef,
            where("receiverId", "==", currentUserId),
            where("read", "==", false),
            limit(20)
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
            const batch = writeBatch(db);
            snap.forEach((msgDoc) => {
                batch.update(msgDoc.ref, { read: true, status: "read" });
            });
            await batch.commit();
        }
    } catch (err) {
        console.warn("[ChatService] markChatAsRead error:", err);
    }
}

/**
 * Fetches available mechanics for starting a new chat
 * Combines Firestore mechanics and catalog mechanics
 */
export async function getAvailableMechanics(searchQuery: string = ""): Promise<ChatParticipant[]> {
    const list: ChatParticipant[] = [];
    const seenIds = new Set<string>();

    // 1. Add catalog mechanics from MOCK_MECHANICS
    MOCK_MECHANICS.forEach((m: Mechanic) => {
        const id = String(m.id);
        if (!seenIds.has(id)) {
            seenIds.add(id);
            list.push({
                id,
                name: m.names || m.fullName || "Mechanic",
                avatar: m.profileImage,
                role: "mechanic",
                online: m.is_online ?? true,
                phone: m.telephone,
                expertise: m.expertise,
                rating: m.rating,
            });
        }
    });

    // 2. Fetch any real mechanics registered in Firestore
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("role", "==", "mechanic"), limit(30));
        const snap = await getDocs(q);
        snap.forEach((d) => {
            const u = d.data();
            const id = d.id;
            if (!seenIds.has(id)) {
                seenIds.add(id);
                list.push({
                    id,
                    name: u.fullName || u.username || "Mechanic",
                    avatar: u.profileImage || u.photoURL,
                    role: "mechanic",
                    online: true,
                    phone: u.phoneNumber,
                    rating: 4.8,
                });
            }
        });
    } catch (err) {
        console.log("[ChatService] Could not fetch firestore mechanics:", err);
    }

    // Filter by searchQuery
    if (!searchQuery.trim()) {
        return list;
    }

    const qLower = searchQuery.toLowerCase().trim();
    return list.filter((item) => {
        return (
            item.name.toLowerCase().includes(qLower) ||
            item.expertise?.some((e) => e.toLowerCase().includes(qLower)) ||
            item.phone?.includes(qLower)
        );
    });
}
