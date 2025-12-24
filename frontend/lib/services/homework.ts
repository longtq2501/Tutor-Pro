import api from './axios-instance';
import type { Homework, ApiResponse, HomeworkStats, HomeworkRequest } from '../types';

export const homeworkApi = {
  // ==================== STUDENT APIs (DÀNH CHO HỌC SINH) ====================
  student: {
    /** * LẤY TẤT CẢ BÀI TẬP VỀ NHÀ CỦA HỌC SINH HIỆN TẠI */
    getAll: async (): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>('/student/homeworks');
      return response.data.data;
    },

    /** * LẤY CHI TIẾT BÀI TẬP THEO ID */
    getById: async (id: number): Promise<Homework> => {
      const response = await api.get<ApiResponse<Homework>>(`/student/homeworks/${id}`);
      return response.data.data;
    },

    /** * LỌC BÀI TẬP THEO TRẠNG THÁI (VÍ DỤ: TODO, SUBMITTED, GRADED) */
    getByStatus: async (status: string): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/student/homeworks/status/${status}`);
      return response.data.data;
    },

    /** * LẤY DANH SÁCH BÀI TẬP SẮP ĐẾN HẠN */
    getUpcoming: async (days: number = 7): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/student/homeworks/upcoming?days=${days}`);
      return response.data.data;
    },

    /** * LẤY DANH SÁCH BÀI TẬP ĐÃ QUÁ HẠN */
    getOverdue: async (): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>('/student/homeworks/overdue');
      return response.data.data;
    },

    /** * CẬP NHẬT TRẠNG THÁI BÀI TẬP */
    updateStatus: async (id: number, status: string): Promise<Homework> => {
      const response = await api.put<ApiResponse<Homework>>(`/student/homeworks/${id}/status`, { status });
      return response.data.data;
    },

    /** * NỘP BÀI TẬP (KÈM GHI CHÚ VÀ ĐƯỜNG DẪN FILE ĐÃ UPLOAD) */
    submit: async (id: number, submissionNotes: string, submissionUrls: string[]): Promise<Homework> => {
      const response = await api.post<ApiResponse<Homework>>(`/student/homeworks/${id}/submit`, {
        submissionNotes,
        submissionUrls,
      });
      return response.data.data;
    },

    /** * TẢI FILE BÀI LÀM LÊN HỆ THỐNG */
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<ApiResponse<{ url: string; filename: string }>>(
        '/student/homeworks/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    },

    /** * LẤY THỐNG KÊ HỌC TẬP CHO HỌC SINH */
    getStats: async (): Promise<HomeworkStats> => {
      const response = await api.get<ApiResponse<HomeworkStats>>('/student/homeworks/stats');
      return response.data.data;
    },

    /** * TÌM KIẾM BÀI TẬP THEO TỪ KHÓA (STUDENT) */
    search: async (keyword: string): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/student/homeworks/search?keyword=${keyword}`);
      return response.data.data;
    },
  },

  // ==================== TUTOR APIs (DÀNH CHO GIA SƯ) ====================
  tutor: {
    /** * TẠO BÀI TẬP MỚI (TUTOR) */
    create: async (data: HomeworkRequest): Promise<Homework> => {
      const response = await api.post<ApiResponse<Homework>>('/tutor/homeworks', data);
      return response.data.data;
    },

    /** * CẬP NHẬT NỘI DUNG BÀI TẬP (TUTOR) */
    update: async (id: number, data: Partial<HomeworkRequest>): Promise<Homework> => {
      const response = await api.put<ApiResponse<Homework>>(`/tutor/homeworks/${id}`, data);
      return response.data.data;
    },

    /** * CHẤM ĐIỂM VÀ NHẬN XÉT BÀI TẬP (TUTOR) */
    grade: async (id: number, score: number, feedback: string): Promise<Homework> => {
      const response = await api.put<ApiResponse<Homework>>(`/tutor/homeworks/${id}/grade`, {
        score,
        feedback,
      });
      return response.data.data;
    },

    /** * XÓA BÀI TẬP (TUTOR) */
    delete: async (id: number): Promise<void> => {
      await api.delete(`/tutor/homeworks/${id}`);
    },

    /** * LẤY DANH SÁCH BÀI TẬP CỦA MỘT HỌC SINH CỤ THỂ (TUTOR) */
    getStudentHomeworks: async (studentId: number): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/tutor/homeworks/student/${studentId}`);
      return response.data.data;
    },

    /** * LẤY THỐNG KÊ BÀI TẬP CỦA HỌC SINH CỤ THỂ (TUTOR) */
    getStudentStats: async (studentId: number): Promise<HomeworkStats> => {
      const response = await api.get<ApiResponse<HomeworkStats>>(`/tutor/homeworks/student/${studentId}/stats`);
      return response.data.data;
    },

    /** * TẢI FILE ĐỀ BÀI HOẶC TÀI LIỆU LÊN (TUTOR) */
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<ApiResponse<{ url: string; filename: string }>>(
        '/tutor/homeworks/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    },
  },

  // ==================== ADMIN APIs (DÀNH CHO QUẢN TRỊ VIÊN) ====================
  admin: {
    /** * LẤY DANH SÁCH BÀI TẬP CỦA HỌC SINH (ADMIN) */
    getStudentHomeworks: async (studentId: number): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/admin/homeworks/student/${studentId}`);
      return response.data.data;
    },

    /** * LỌC BÀI TẬP CỦA HỌC SINH THEO TRẠNG THÁI (ADMIN) */
    getByStatus: async (studentId: number, status: string): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/admin/homeworks/student/${studentId}/status/${status}`);
      return response.data.data;
    },

    /** * LẤY THỐNG KÊ CHI TIẾT BÀI TẬP CỦA HỌC SINH (ADMIN) */
    getStudentStats: async (studentId: number): Promise<HomeworkStats> => {
      const response = await api.get<ApiResponse<HomeworkStats>>(`/admin/homeworks/student/${studentId}/stats`);
      return response.data.data;
    },

    /** * LẤY CÁC BÀI TẬP SẮP ĐẾN HẠN CỦA HỌC SINH (ADMIN) */
    getUpcoming: async (studentId: number, days: number = 7): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/admin/homeworks/student/${studentId}/upcoming?days=${days}`);
      return response.data.data;
    },

    /** * LẤY CÁC BÀI TẬP ĐÃ QUÁ HẠN CỦA HỌC SINH (ADMIN) */
    getOverdue: async (studentId: number): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/admin/homeworks/student/${studentId}/overdue`);
      return response.data.data;
    },

    /** * LẤY TỔNG HỢP THỐNG KÊ (ADMIN) */
    getStats: async (studentId: number): Promise<HomeworkStats> => {
      const response = await api.get<ApiResponse<HomeworkStats>>(`/admin/homeworks/student/${studentId}/stats`);
      return response.data.data;
    },

    /** * LẤY CHI TIẾT MỘT BÀI TẬP (ADMIN) */
    getById: async (id: number): Promise<Homework> => {
      const response = await api.get<ApiResponse<Homework>>(`/admin/homeworks/${id}`);
      return response.data.data;
    },

    /** * TẠO MỚI BÀI TẬP CHO HỌC SINH (ADMIN) */
    create: async (data: HomeworkRequest): Promise<Homework> => {
      const response = await api.post<ApiResponse<Homework>>('/admin/homeworks', data);
      return response.data.data;
    },

    /** * CẬP NHẬT NỘI DUNG BÀI TẬP (ADMIN) */
    update: async (id: number, data: Partial<HomeworkRequest>): Promise<Homework> => {
      const response = await api.put<ApiResponse<Homework>>(`/admin/homeworks/${id}`, data);
      return response.data.data;
    },

    /** * CHẤM ĐIỂM VÀ FEEDBACK BÀI TẬP (ADMIN) */
    grade: async (id: number, score: number, feedback: string): Promise<Homework> => {
      const response = await api.put<ApiResponse<Homework>>(`/admin/homeworks/${id}/grade`, {
        score,
        feedback,
      });
      return response.data.data;
    },

    /** * XÓA BÀI TẬP KHỎI HỆ THỐNG (ADMIN) */
    delete: async (id: number): Promise<void> => {
      await api.delete(`/admin/homeworks/${id}`);
    },

    /** * TÌM KIẾM BÀI TẬP CỦA HỌC SINH (ADMIN) */
    search: async (studentId: number, keyword: string): Promise<Homework[]> => {
      const response = await api.get<ApiResponse<Homework[]>>(`/admin/homeworks/search?studentId=${studentId}&keyword=${keyword}`);
      return response.data.data;
    },

    /** * TẢI FILE LÊN HỆ THỐNG (ADMIN) */
    uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<ApiResponse<{ url: string; filename: string }>>(
        '/admin/homeworks/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data;
    },
  },
};