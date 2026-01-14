import api from './axios-instance';
import type { ApiResponse } from '../types';
import type { LessonCategoryDTO, LessonCategoryRequest } from '@/features/learning/lessons/types';

export const lessonCategoryApi = {
    /**
     * Lấy tất cả danh mục bài giảng
     * GET /api/lesson-categories
     */
    getAll: async (): Promise<LessonCategoryDTO[]> => {
        const response = await api.get<ApiResponse<LessonCategoryDTO[]>>('/lesson-categories');
        return response.data.data;
    },

    /**
     * Lấy chi tiết danh mục theo ID
     * GET /api/lesson-categories/{id}
     */
    getById: async (id: number): Promise<LessonCategoryDTO> => {
        const response = await api.get<ApiResponse<LessonCategoryDTO>>(`/lesson-categories/${id}`);
        return response.data.data;
    },

    /**
     * Tạo danh mục mới
     * POST /api/lesson-categories
     */
    create: async (request: LessonCategoryRequest): Promise<LessonCategoryDTO> => {
        const response = await api.post<ApiResponse<LessonCategoryDTO>>('/lesson-categories', request);
        return response.data.data;
    },

    /**
     * Cập nhật danh mục
     * PUT /api/lesson-categories/{id}
     */
    update: async (id: number, request: LessonCategoryRequest): Promise<LessonCategoryDTO> => {
        const response = await api.put<ApiResponse<LessonCategoryDTO>>(`/lesson-categories/${id}`, request);
        return response.data.data;
    },

    /**
     * Xóa danh mục
     * DELETE /api/lesson-categories/{id}
     */
    delete: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/lesson-categories/${id}`);
    },
};
