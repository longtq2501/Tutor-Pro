import api from './axios-instance';
import type { ApiResponse } from '../types';
import type {
    CourseDTO,
    CourseDetailDTO,
    CourseRequest,
    CourseAssignmentDTO,
    AssignCourseRequest,
} from '@/features/learning/courses/types';


/**
 * API cho admin và tutor (Latest update: 2024-01-14)
 */
export const courseAdminApi = {
    /**
     * Lấy danh sách tất cả khóa học
     */
    getAll: async (): Promise<CourseDTO[]> => {
        const response = await api.get<ApiResponse<CourseDTO[]>>('/courses');
        return response.data.data;
    },

    /**
     * Lấy chi tiết khóa học (bao gồm bài giảng)
     */
    getById: async (id: number): Promise<CourseDetailDTO> => {
        const response = await api.get<ApiResponse<CourseDetailDTO>>(`/courses/${id}`);
        return response.data.data;
    },

    /**
     * Tạo khóa học mới
     */
    create: async (data: CourseRequest): Promise<CourseDTO> => {
        const response = await api.post<ApiResponse<CourseDTO>>('/courses', data);
        return response.data.data;
    },

    /**
     * Cập nhật khóa học
     */
    update: async (id: number, data: CourseRequest): Promise<CourseDTO> => {
        const response = await api.put<ApiResponse<CourseDTO>>(`/courses/${id}`, data);
        return response.data.data;
    },

    /**
     * Xóa khóa học
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/courses/${id}`);
        return response.data.data;
    },

    /**
     * Thêm bài giảng vào khóa học
     */
    addLessons: async (id: number, lessonIds: number[]): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(`/courses/${id}/lessons`, lessonIds);
        return response.data.data;
    },

    /**
     * Xóa bài giảng khỏi khóa học
     */
    removeLesson: async (id: number, lessonId: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/courses/${id}/lessons/${lessonId}`);
        return response.data.data;
    },

    /**
     * Giao khóa học cho học sinh
     */
    assign: async (id: number, data: AssignCourseRequest): Promise<CourseAssignmentDTO[]> => {
        const response = await api.post<ApiResponse<CourseAssignmentDTO[]>>(`/courses/${id}/assign`, data);
        return response.data.data;
    },

    /**
     * Lấy danh sách học sinh đã được giao khóa học
     */
    getAssignments: async (id: number): Promise<CourseAssignmentDTO[]> => {
        const response = await api.get<ApiResponse<CourseAssignmentDTO[]>>(`/courses/${id}/assignments`);
        return response.data.data;
    },

    /**
     * Thu hồi khóa học từ học sinh
     */
    unassign: async (id: number, studentId: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(`/courses/${id}/students/${studentId}`);
        return response.data.data;
    },
};
