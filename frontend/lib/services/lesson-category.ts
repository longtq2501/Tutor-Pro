import api from './axios-instance';
import type { ApiResponse } from '../types';
import type { LessonCategoryDTO, LessonCategoryRequest } from '@/features/learning/lessons/types';

export const lessonCategoryApi = {
    /**
     * Lấy tất cả danh mục bài giảng
     * GET /api/admin/lesson-categories
     */
    getAll: async (): Promise<LessonCategoryDTO[]> => {
        const response = await api.get<ApiResponse<LessonCategoryDTO[]>>('/admin/lesson-categories');
        return response.data.data;
    },

    /**
     * Lấy chi tiết danh mục theo ID
     * GET /api/admin/lesson-categories/{id}
     */
    getById: async (id: number): Promise<LessonCategoryDTO> => {
        const response = await api.get<ApiResponse<LessonCategoryDTO>>(`/admin/lesson-categories/${id}`);
        return response.data.data;
    },

    /**
     * Tạo danh mục mới
     * POST /api/admin/lesson-categories
     */
    create: async (request: LessonCategoryRequest): Promise<LessonCategoryDTO> => {
        const response = await api.post<ApiResponse<LessonCategoryDTO>>('/admin/lesson-categories', request);
        return response.data.data;
    },

    /**
     * Cập nhật danh mục
     * PUT /api/admin/lesson-categories/{id}
     */
    update: async (id: number, request: LessonCategoryRequest): Promise<LessonCategoryDTO> => {
        const response = await api.put<ApiResponse<LessonCategoryDTO>>(`/admin/lesson-categories/${id}`, request);
        return response.data.data;
    },

    /**
     * Xóa danh mục
     * DELETE /api/admin/lesson-categories/{id}
     */
    delete: async (id: number): Promise<void> => {
        await api.delete<ApiResponse<void>>(`/admin/lesson-categories/${id}`);
    },
};
