import api from './axios-instance';
import type {
    OnlineSessionResponse,
    JoinRoomResponse,
    RoomStatsResponse,
    GlobalStatsResponse,
    CreateOnlineSessionRequest
} from '@/lib/types/onlineSession';

export const onlineSessionApi = {
    /**
     * CREATE A NEW ONLINE SESSION
     * Accessible by TUTOR and ADMIN roles.
     * @param {CreateOnlineSessionRequest} data - Session creation details
     * @returns {Promise<OnlineSessionResponse>} The created session details
     */
    createSession: async (data: CreateOnlineSessionRequest): Promise<OnlineSessionResponse> => {
        const response = await api.post('/online-sessions', data);
        return response.data.data;
    },

    /**
     * JOIN AN ONLINE SESSION
     * Returns JWT token and WebRTC configuration.
     * @param {string} roomId - Unique identifier for the room
     * @returns {Promise<JoinRoomResponse>} Token and room configuration
     */
    joinRoom: async (roomId: string): Promise<JoinRoomResponse> => {
        const response = await api.post(`/online-sessions/${roomId}/join`);
        return response.data.data;
    },

    /**
     * RETRIEVE STATISTICS FOR A SPECIFIC SESSION
     * @param {string} roomId - Unique identifier for the room
     * @returns {Promise<RoomStatsResponse>} Room statistics
     */
    getRoomStats: async (roomId: string): Promise<RoomStatsResponse> => {
        const response = await api.get(`/online-sessions/${roomId}/stats`);
        return response.data.data;
    },

    /**
     * RETRIEVE GLOBAL STATISTICS ACROSS ALL SESSIONS
     * ADMIN role only.
     * @returns {Promise<GlobalStatsResponse>} Global statistics
     */
    getGlobalStats: async (): Promise<GlobalStatsResponse> => {
        const response = await api.get('/online-sessions/stats');
        return response.data.data;
    },

    /**
     * END AN ONLINE SESSION MANUALLY
     * @param {string} roomId - Unique identifier for the room
     * @returns {Promise<OnlineSessionResponse>} Updated session details
     */
    endSession: async (roomId: string): Promise<OnlineSessionResponse> => {
        const response = await api.post(`/online-sessions/${roomId}/end`);
        return response.data.data;
    },
};
