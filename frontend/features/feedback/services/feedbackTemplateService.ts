import {
    FeedbackTemplate,
    FeedbackTemplateRequest,
} from '@/features/feedback/types';
import axios from '@/lib/services/axios-instance';
import { ApiResponse } from '@/lib/types';

const BASE_URL = '/feedback-templates';

export const feedbackTemplateService = {
    getTemplates: async (category?: string): Promise<FeedbackTemplate[]> => {
        const response = await axios.get<ApiResponse<FeedbackTemplate[]>>(BASE_URL, {
            params: category ? { category } : undefined,
        });
        return response.data.data;
    },

    createTemplate: async (data: FeedbackTemplateRequest): Promise<FeedbackTemplate> => {
        const response = await axios.post<ApiResponse<FeedbackTemplate>>(BASE_URL, data);
        return response.data.data;
    },

    updateTemplate: async (id: number, data: FeedbackTemplateRequest): Promise<FeedbackTemplate> => {
        const response = await axios.put<ApiResponse<FeedbackTemplate>>(`${BASE_URL}/${id}`, data);
        return response.data.data;
    },

    deleteTemplate: async (id: number): Promise<void> => {
        await axios.delete<ApiResponse<void>>(`${BASE_URL}/${id}`);
    },
};
