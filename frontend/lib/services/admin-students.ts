import api from './axios-instance';
import type { AdminStudent } from '../types/admin';
import type { PageResponse } from '../types/common';

export const adminStudentsApi = {
    getAll: async (
        page = 0,
        size = 20,
        search = '',
        tutorId?: number,
        active?: boolean
    ): Promise<PageResponse<AdminStudent>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (search) params.append('search', search);
        if (tutorId) params.append('tutorId', tutorId.toString());
        if (active !== undefined) params.append('active', active.toString());

        const response = await api.get(`/admin/students?${params.toString()}`);
        return response.data.data;
    },

    getById: async (id: number): Promise<AdminStudent> => {
        const response = await api.get(`/admin/students/${id}`);
        return response.data.data;
    },
};
