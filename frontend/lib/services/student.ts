import api from './axios-instance';
import type { Student, StudentRequest } from '../types';

export const studentsApi = {
  /** * LẤY DANH SÁCH TẤT CẢ HỌC SINH
   * @returns {Promise<Student[]>} Mảng đối tượng học sinh
   */
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },

  /** * LẤY THÔNG TIN CHI TIẾT MỘT HỌC SINH THEO ID
   * @param {number} id - ID của học sinh cần tìm
   * @returns {Promise<Student>} Đối tượng học sinh
   */
  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  /** * TẠO MỚI MỘT HỌC SINH
   * @param {StudentRequest} data - Dữ liệu học sinh mới
   * @returns {Promise<Student>} Đối tượng học sinh vừa tạo
   */
  create: async (data: StudentRequest): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  /** * CẬP NHẬT THÔNG TIN HỌC SINH
   * @param {number} id - ID học sinh cần cập nhật
   * @param {StudentRequest} data - Dữ liệu cập nhật mới
   * @returns {Promise<Student>} Đối tượng học sinh sau khi sửa
   */
  update: async (id: number, data: StudentRequest): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  /** * XÓA HỌC SINH KHỎI HỆ THỐNG
   * @param {number} id - ID học sinh cần xóa
   * @returns {Promise<void>}
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  /** * THAY ĐỔI TRẠNG THÁI HOẠT ĐỘNG (KÍCH HOẠT/KHÓA) CỦA HỌC SINH
   * @param {number} id - ID học sinh
   * @returns {Promise<Student>} Đối tượng học sinh với trạng thái mới
   */
  toggleActive: async (id: number): Promise<Student> => {
    const response = await api.put(`/students/${id}/toggle-active`);
    return response.data;
  },
};