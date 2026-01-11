import type { DashboardStats } from '@/features/dashboard/admin-dashboard/types/dashboard.types';
import type { MonthlyStats } from '../types';
import api from './axios-instance';

export const dashboardApi = {
  /** * LẤY THỐNG KÊ TỔNG QUAN DASHBOARD THEO THÁNG HIỆN TẠI
   * @param {string} currentMonth - Tháng cần lấy số liệu (Ví dụ: "2023-12")
   * @returns {Promise<DashboardStats>} Dữ liệu bao gồm tổng doanh thu, số học sinh, số buổi học...
   */
  getStats: async (currentMonth: string): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats', {
      params: { currentMonth }
    });
    return response.data.data;
  },

  getMonthlyStats: async (): Promise<MonthlyStats[]> => {
    const response = await api.get('/dashboard/monthly-stats');
    return response.data.data;
  },

  /** * LẤY SỐ LIỆU DASHBOARD CHO HỌC SINH (Student Delight Edition)
   * @param {number} studentId - ID của học sinh
   * @param {string} currentMonth - Tháng hiện tại
   */
  getStudentStats: async (studentId: number, currentMonth: string): Promise<import('@/features/dashboard/student-dashboard/types/dashboard.types').StudentDashboardStats> => {
    const response = await api.get('/dashboard/student/stats', {
      params: { studentId, currentMonth }
    });
    return response.data.data;
  },

  exportPdf: async (currentMonth?: string): Promise<Blob> => {
    const response = await api.get('/dashboard/export-pdf', {
      params: { currentMonth },
      responseType: 'blob'
    });
    return response.data; // Blob is usually return directly as data
  }
};