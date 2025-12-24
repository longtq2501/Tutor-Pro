import api from './axios-instance';
import type { Parent, ParentRequest } from '../types';

export const parentsApi = {
  /** * LẤY DANH SÁCH TẤT CẢ PHỤ HUYNH
   * @returns {Promise<Parent[]>} Mảng đối tượng phụ huynh
   */
  getAll: async (): Promise<Parent[]> => {
    const response = await api.get('/parents');
    return response.data;
  },

  /** * LẤY THÔNG TIN CHI TIẾT PHỤ HUYNH THEO ID
   * @param {number} id - ID của phụ huynh cần tìm
   * @returns {Promise<Parent>} Đối tượng phụ huynh
   */
  getById: async (id: number): Promise<Parent> => {
    const response = await api.get(`/parents/${id}`);
    return response.data;
  },

  /** * TẠO MỚI THÔNG TIN PHỤ HUYNH
   * @param {ParentRequest} data - Dữ liệu phụ huynh mới (Tên, SĐT, Email...)
   * @returns {Promise<Parent>} Đối tượng phụ huynh vừa tạo
   */
  create: async (data: ParentRequest): Promise<Parent> => {
    const response = await api.post('/parents', data);
    return response.data;
  },

  /** * CẬP NHẬT THÔNG TIN PHỤ HUYNH
   * @param {number} id - ID phụ huynh cần cập nhật
   * @param {ParentRequest} data - Dữ liệu cập nhật mới
   * @returns {Promise<Parent>} Đối tượng phụ huynh sau khi sửa
   */
  update: async (id: number, data: ParentRequest): Promise<Parent> => {
    const response = await api.put(`/parents/${id}`, data);
    return response.data;
  },

  /** * XÓA PHỤ HUYNH KHỎI HỆ THỐNG
   * @param {number} id - ID phụ huynh cần xóa
   * @returns {Promise<void>}
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/parents/${id}`);
  },

  /** * TÌM KIẾM PHỤ HUYNH THEO TÊN HOẶC SỐ ĐIỆN THOẠI
   * @param {string} keyword - Từ khóa tìm kiếm (Tên, SĐT, Email)
   * @returns {Promise<Parent[]>} Danh sách phụ huynh khớp với từ khóa
   */
  search: async (keyword: string): Promise<Parent[]> => {
    const response = await api.get('/parents/search', { params: { keyword } });
    return response.data;
  },
};