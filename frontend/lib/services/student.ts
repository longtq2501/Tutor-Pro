import api from './axios-instance';
import type { Student, StudentRequest } from '../types';
import type { PageResponse } from '../types/common';

export const studentsApi = {
  /** * LẤY DANH SÁCH TẤT CẢ HỌC SINH (PHÂN TRANG)
   * @param {number} page - Số trang (bắt đầu từ 0)
   * @param {number} size - Kích thước trang
   * @returns {Promise<PageResponse<Student>>} Đối tượng phân trang học sinh
   */
  getAll: async (page = 0, size = 100): Promise<PageResponse<Student>> => {
    const response = await api.get(`/students?page=${page}&size=${size}`);
    return response.data.data;
  },

  /** * LẤY THÔNG TIN CHI TIẾT MỘT HỌC SINH THEO ID
   * @param {number} id - ID của học sinh cần tìm
   * @returns {Promise<Student>} Đối tượng học sinh
   */
  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
  },

  /** * TẠO MỚI MỘT HỌC SINH
   * @param {StudentRequest} data - Dữ liệu học sinh mới
   * @returns {Promise<Student>} Đối tượng học sinh vừa tạo
   */
  create: async (data: StudentRequest): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data.data;
  },

  /** * CẬP NHẬT THÔNG TIN HỌC SINH
   * @param {number} id - ID học sinh cần cập nhật
   * @param {StudentRequest} data - Dữ liệu cập nhật mới
   * @returns {Promise<Student>} Đối tượng học sinh sau khi sửa
   */
  update: async (id: number, data: StudentRequest): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data.data;
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
    return response.data.data;
  },
};