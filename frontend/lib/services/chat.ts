import api from './axios-instance';
import type { ChatMessageResponse } from '@/lib/types/chat';

export interface PaginatedChatResponse {
    content: ChatMessageResponse[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageNumber: number;
        pageSize: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export const chatApi = {
    /**
     * RETRIEVE PAGINATED CHAT MESSAGES FOR A ROOM
     * @param {string} roomId - Unique identifier for the room
     * @param {number} page - Page number to fetch
     * @param {number} size - Number of messages per page
     * @returns {Promise<PaginatedChatResponse>} Paginated messages
     */
    getMessages: async (roomId: string, page = 0, size = 50): Promise<PaginatedChatResponse> => {
        const response = await api.get(`/online-sessions/${roomId}/messages`, {
            params: { page, size }
        });
        return response.data.data;
    },
};
