import api from './axios-instance';
import type { DashboardStats, MonthlyStats } from '../types';

export const dashboardApi = {
  /** * LẤY THỐNG KÊ TỔNG QUAN DASHBOARD THEO THÁNG HIỆN TẠI
   * @param {string} currentMonth - Tháng cần lấy số liệu (Ví dụ: "2023-12")
   * @returns {Promise<DashboardStats>} Dữ liệu bao gồm tổng doanh thu, số học sinh, số buổi học...
   */
  getStats: async (currentMonth: string): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats', {
      params: { currentMonth }
    });
    return response.data;
  },

  /** * LẤY DỮ LIỆU THỐNG KÊ BIẾN ĐỘNG THEO TỪNG THÁNG
   * @returns {Promise<MonthlyStats[]>} Mảng dữ liệu dùng để vẽ biểu đồ tăng trưởng (Line/Bar Chart)
   */
  getMonthlyStats: async (): Promise<MonthlyStats[]> => {
    const response = await api.get('/dashboard/monthly-stats');
    return response.data;
  },
};