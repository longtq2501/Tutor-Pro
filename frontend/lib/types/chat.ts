/**
 * TypeScript types for Chat messages.
 * Matches the backend DTOs in com.tutor_management.backend.modules.onlinesession.dto.
 */

export interface ChatMessageResponse {
    id: number;
    roomId: string;
    senderId: number;
    senderName: string;
    senderRole: 'ADMIN' | 'TUTOR' | 'STUDENT';
    content: string;
    timestamp: string;
}

export interface ChatMessageRequest {
    content: string;
}
