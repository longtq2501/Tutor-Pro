import axiosInstance from "./axios-instance";
import type { SessionRecord } from "../types/finance";
import type { PageResponse } from "../types/common";

export const adminSessionsApi = {
    getAll: async (page = 0, size = 10): Promise<PageResponse<SessionRecord>> => {
        const response = await axiosInstance.get(`/api/sessions?page=${page}&size=${size}`);
        return response.data.data;
    },

    getByMonth: async (month: string, page = 0, size = 10): Promise<PageResponse<SessionRecord>> => {
        const response = await axiosInstance.get(`/api/sessions/month/${month}?page=${page}&size=${size}`);
        return response.data.data;
    },

    getMonths: async (): Promise<string[]> => {
        const response = await axiosInstance.get('/api/sessions/months');
        return response.data.data;
    }
};
