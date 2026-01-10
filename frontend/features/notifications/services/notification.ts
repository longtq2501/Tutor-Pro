import api from '@/lib/services/axios-instance';
import { Notification } from '../types';

/**
 * Service for interacting with notification-related API endpoints.
 */
export const notificationService = {
    /**
     * Fetches all notifications for the current authenticated user.
     * @returns A promise resolving to an array of Notifications.
     */
    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/notifications');
        return response.data.data;
    },

    /**
     * Retrieves the count of unread notifications.
     * @returns A promise resolving to the unread count.
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await api.get('/notifications/unread-count');
        return response.data.data;
    },

    /**
     * Updates a single notification's status to 'read'.
     * @param id The ID of the notification to mark.
     */
    markAsRead: async (id: number): Promise<void> => {
        await api.patch(`/notifications/${id}/read`);
    },

    /**
     * Updates all unread notifications for the user to 'read' in bulk.
     */
    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notifications/read-all');
    },
};
