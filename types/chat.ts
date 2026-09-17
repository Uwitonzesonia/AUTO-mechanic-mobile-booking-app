export interface ChatParticipant {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    fcmToken?: string;
    online?: boolean;
    phone?: string;
    expertise?: string[];
    rating?: number;
}

export interface ChatMessage {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    receiverId: string;
    receiverName?: string;
    text: string;
    createdAt: any;
    read: boolean;
    status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatConversation {
    id: string;
    participants: string[];
    participantDetails: Record<string, ChatParticipant>;
    lastMessage?: {
        text: string;
        senderId: string;
        senderName?: string;
        createdAt: any;
        read: boolean;
    };
    unreadCount?: Record<string, number>;
    createdAt: any;
    updatedAt: any;
}
