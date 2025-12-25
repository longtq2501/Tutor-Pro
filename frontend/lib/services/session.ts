import api from './axios-instance';
import type { SessionRecord, SessionRecordRequest, SessionRecordUpdateRequest } from '../types';

export const sessionsApi = {
  /** * LẤY DANH SÁCH TẤT CẢ CÁC BUỔI HỌC
   * @returns {Promise<SessionRecord[]>} Mảng các bản ghi buổi học
   */
  getAll: async (): Promise<SessionRecord[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },

  /** * LẤY DANH SÁCH BUỔI HỌC THEO THÁNG CỤ THỂ
   * @param {string} month - Định dạng tháng (Ví dụ: "2023-12")
   * @returns {Promise<SessionRecord[]>}
   */
  getByMonth: async (month: string): Promise<SessionRecord[]> => {
    const response = await api.get(`/sessions/month/${month}`);
    return response.data;
  },

  /** * LẤY DANH SÁCH CÁC THÁNG ĐÃ CÓ DỮ LIỆU BUỔI HỌC
   * @returns {Promise<string[]>} Mảng các chuỗi định dạng tháng
   */
  getMonths: async (): Promise<string[]> => {
    const response = await api.get('/sessions/months');
    return response.data;
  },

  /** * TẠO MỚI MỘT BẢN GHI BUỔI HỌC
   * @param {SessionRecordRequest} data - Thông tin buổi học mới
   * @returns {Promise<SessionRecord>}
   */
  create: async (data: SessionRecordRequest): Promise<SessionRecord> => {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  /** * CẬP NHẬT THÔNG TIN BUỔI HỌC
   * @param {number} id - ID buổi học cần sửa
   * @param {Partial<SessionRecordRequest>} data - Dữ liệu cập nhật một phần
   * @returns {Promise<SessionRecord>}
   */
  update: async (id: number, data: SessionRecordUpdateRequest): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },

  /** * THAY ĐỔI TRẠNG THÁI THANH TOÁN CỦA BUỔI HỌC
   * @param {number} id - ID buổi học
   * @returns {Promise<SessionRecord>}
   */
  togglePayment: async (id: number): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}/toggle-payment`);
    return response.data;
  },

  /** * XÓA BẢN GHI BUỔI HỌC KHỎI HỆ THỐNG
   * @param {number} id - ID buổi học cần xóa
   * @returns {Promise<void>}
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },

  /** * LẤY DANH SÁCH CÁC BUỔI HỌC CHƯA ĐƯỢC THANH TOÁN
   * @returns {Promise<SessionRecord[]>}
   */
  getUnpaid: async (): Promise<SessionRecord[]> => {
    const response = await api.get('/sessions/unpaid');
    return response.data;
  },

  /** * THAY ĐỔI TRẠNG THÁI HOÀN THÀNH (ĐÃ DẠY/CHƯA DẠY) CỦA BUỔI HỌC
   * @param {number} id - ID buổi học
   * @returns {Promise<SessionRecord>}
   */
  toggleCompleted: async (id: number): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}/toggle-completed`);
    return response.data;
  },

  /**
   * Lấy thông tin chi tiết của một buổi học
   */
  getById: async (id: number): Promise<SessionRecord> => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  /**
   * Cập nhật trạng thái buổi học (Optimistic Locking)
   */
  updateStatus: async (id: number, newStatus: string, version: number): Promise<SessionRecord> => {
    const response = await api.patch(`/sessions/${id}/status`, null, {
      params: { newStatus, version }
    });
    return response.data;
  },

  /**
   * Nhân bản một buổi học
   */
  duplicate: async (id: number): Promise<SessionRecord> => {
    const response = await api.post(`/sessions/${id}/duplicate`);
    return response.data;
  },

  /**
   * Xuất danh sách buổi học ra file Excel
   */
  exportToExcel: async (month?: string, studentId?: number): Promise<void> => {
    const response = await api.get('/sessions/export/excel', {
      params: { month, studentId },
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sessions_Export_${month || 'All'}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  },
};