import api from './axios-instance';
import type { ApiResponse } from '../types';
import type {
  LessonDTO,
  LessonLibraryDTO,
  StudentAssignmentDTO,
  CreateLessonRequest,
  UpdateLessonRequest,
  CreateLibraryLessonRequest,
  AssignLessonRequest,
} from '@/features/learning/lessons/types';

// ============================================================================
// LESSON LIBRARY API
// ============================================================================

export const lessonLibraryApi = {
  /**
   * LẤY DANH SÁCH TOÀN BỘ KHO BÀI GIẢNG MẪU
   * GET /api/admin/lesson-library
   * @returns {Promise<LessonLibraryDTO[]>} Danh sách bài giảng trong kho
   */
  getAll: async (): Promise<LessonLibraryDTO[]> => {
    const response = await api.get<ApiResponse<LessonLibraryDTO[]>>(
      '/admin/lesson-library'
    );
    return response.data.data;
  },

  /**
   * LẤY DANH SÁCH BÀI GIẢNG CHƯA ĐƯỢC GIAO CHO BẤT KỲ HỌC SINH NÀO
   * GET /api/admin/lesson-library/unassigned
   * @returns {Promise<LessonLibraryDTO[]>} Danh sách bài giảng chưa giao
   */
  getUnassigned: async (): Promise<LessonLibraryDTO[]> => {
    const response = await api.get<ApiResponse<LessonLibraryDTO[]>>(
      '/admin/lesson-library/unassigned'
    );
    return response.data.data;
  },

  /**
   * LẤY DANH SÁCH HỌC SINH ĐÃ ĐƯỢC GIAO BÀI GIẢNG CỤ THỂ
   * GET /api/admin/lesson-library/{lessonId}/students
   * @param {number} lessonId - ID của bài giảng
   * @returns {Promise<StudentAssignmentDTO[]>} Danh sách học sinh đã được giao
   */
  getAssignedStudents: async (
    lessonId: number
  ): Promise<StudentAssignmentDTO[]> => {
    const response = await api.get<ApiResponse<StudentAssignmentDTO[]>>(
      `/admin/lesson-library/${lessonId}/students`
    );
    return response.data.data;
  },

  /**
   * TẠO BÀI GIẢNG MỚI VÀO KHO
   * POST /api/admin/lesson-library
   * @param {CreateLibraryLessonRequest} data - Dữ liệu bài giảng mới
   * @returns {Promise<LessonLibraryDTO>} Bài giảng vừa tạo
   */
  create: async (
    data: CreateLibraryLessonRequest
  ): Promise<LessonLibraryDTO> => {
    const response = await api.post<ApiResponse<LessonLibraryDTO>>(
      '/admin/lesson-library',
      {
        ...data,
        isPublished: data.isPublished ?? false,
        images: data.images ?? [],
        resources: data.resources ?? [],
      }
    );
    return response.data.data;
  },

  /**
   * GIAO BÀI GIẢNG TỪ KHO CHO CÁC HỌC SINH
   * POST /api/admin/lesson-library/{lessonId}/assign
   * @param {number} lessonId - ID bài giảng
   * @param {AssignLessonRequest} data - Danh sách ID học sinh
   * @returns {Promise<void>}
   */
  assign: async (
    lessonId: number,
    data: AssignLessonRequest
  ): Promise<void> => {
    const response = await api.post<ApiResponse<void>>(
      `/admin/lesson-library/${lessonId}/assign`,
      data
    );
    return response.data.data;
  },

  /**
   * THU HỒI BÀI GIẢNG TỪ CÁC HỌC SINH
   * POST /api/admin/lesson-library/{lessonId}/unassign
   * @param {number} lessonId - ID bài giảng
   * @param {AssignLessonRequest} data - Danh sách ID học sinh cần thu hồi
   * @returns {Promise<void>}
   */
  unassign: async (
    lessonId: number,
    data: AssignLessonRequest
  ): Promise<void> => {
    const response = await api.post<ApiResponse<void>>(
      `/admin/lesson-library/${lessonId}/unassign`,
      data
    );
    return response.data.data;
  },

  /**
   * XÓA BÀI GIẢNG KHỎI KHO
   * DELETE /api/admin/lesson-library/{lessonId}
   * @param {number} lessonId - ID bài giảng cần xóa
   * @returns {Promise<void>}
   */
  delete: async (lessonId: number): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(
      `/admin/lesson-library/${lessonId}`
    );
    return response.data.data;
  },
};

// ============================================================================
// ADMIN LESSONS API (BÀI GIẢNG ĐANG DẠY)
// ============================================================================

export const adminLessonsApi = {
  /**
   * LẤY TẤT CẢ BÀI GIẢNG ĐANG DẠY
   * GET /api/admin/lessons
   * @returns {Promise<LessonDTO[]>} Danh sách bài giảng
   */
  getAll: async (): Promise<LessonDTO[]> => {
    const response = await api.get<ApiResponse<LessonDTO[]>>('/admin/lessons');
    return response.data.data;
  },

  /**
   * LẤY CHI TIẾT BÀI GIẢNG
   * GET /api/admin/lessons/{id}
   * @param {number} id - ID bài giảng
   * @returns {Promise<LessonDTO>} Thông tin chi tiết bài giảng
   */
  getById: async (id: number): Promise<LessonDTO> => {
    const response = await api.get<ApiResponse<LessonDTO>>(
      `/admin/lessons/${id}`
    );
    return response.data.data;
  },

  /**
   * LỌC BÀI GIẢNG THEO HỌC SINH
   * GET /api/admin/lessons/student/{studentId}
   * @param {number} studentId - ID học sinh
   * @returns {Promise<LessonDTO[]>} Danh sách bài giảng của học sinh
   */
  getByStudent: async (studentId: number): Promise<LessonDTO[]> => {
    const response = await api.get<ApiResponse<LessonDTO[]>>(
      `/admin/lessons/student/${studentId}`
    );
    return response.data.data;
  },

  /**
   * TẠO VÀ GIAO BÀI GIẢNG TRỰC TIẾP CHO HỌC SINH
   * POST /api/admin/lessons
   * @param {CreateLessonRequest} data - Dữ liệu bài giảng và danh sách học sinh
   * @returns {Promise<LessonDTO>} Bài giảng vừa tạo
   */
  create: async (data: CreateLessonRequest): Promise<LessonDTO> => {
    const response = await api.post<ApiResponse<LessonDTO>>(
      '/admin/lessons',
      {
        ...data,
        images: data.images ?? [],
        resources: data.resources ?? [],
        studentIds: data.studentIds ?? [],
      }
    );
    return response.data.data;
  },

  /**
   * CẬP NHẬT THÔNG TIN BÀI GIẢNG
   * PUT /api/admin/lessons/{id}
   * @param {number} id - ID bài giảng
   * @param {UpdateLessonRequest} data - Dữ liệu cập nhật
   * @returns {Promise<LessonDTO>} Bài giảng sau khi cập nhật
   */
  update: async (id: number, data: UpdateLessonRequest): Promise<LessonDTO> => {
    const response = await api.put<ApiResponse<LessonDTO>>(
      `/admin/lessons/${id}`,
      {
        ...data,
        images: data.images ?? [],
        resources: data.resources ?? [],
      }
    );
    return response.data.data;
  },

  /**
   * BẬT/TẮT TRẠNG THÁI PUBLISH CỦA BÀI GIẢNG
   * PUT /api/admin/lessons/{id}/toggle-publish
   * @param {number} id - ID bài giảng
   * @returns {Promise<LessonDTO>} Bài giảng sau khi toggle
   */
  togglePublish: async (id: number): Promise<LessonDTO> => {
    const response = await api.put<ApiResponse<LessonDTO>>(
      `/admin/lessons/${id}/toggle-publish`
    );
    return response.data.data;
  },

  /**
   * XÓA BÀI GIẢNG THỰC TÊ
   * Xóa bài giảng khỏi tất cả học sinh
   * DELETE /api/admin/lessons/{id}
   * @param {number} id - ID bài giảng cần xóa
   * @returns {Promise<void>}
   */
  delete: async (id: number): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(
      `/admin/lessons/${id}`
    );
    return response.data.data;
  },
};