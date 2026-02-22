import api from './axios-instance';
import type { AdminDocument, AdminDocumentStats } from '../types/admin';
import type { PageResponse } from '../types/common';

export const adminDocumentsApi = {
    getAll: async (
        page = 0,
        size = 20,
        search = '',
        tutorId?: number,
        category = ''
    ): Promise<PageResponse<AdminDocument>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        if (search) params.append('search', search);
        if (tutorId) params.append('tutorId', tutorId.toString());
        if (category) params.append('category', category);

        const response = await api.get(`/admin/documents?${params.toString()}`);
        return response.data.data;
    },

    getStats: async (): Promise<AdminDocumentStats> => {
        const response = await api.get('/admin/documents/stats');
        return response.data.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/admin/documents/${id}`);
    },
};
