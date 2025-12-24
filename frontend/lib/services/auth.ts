import api from './axios-instance';

/** * GIAO DIỆN THÔNG TIN NGƯỜI DÙNG */
export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TUTOR' | 'STUDENT';
  studentId?: number; 
}

export const authService = {
  /** * ĐĂNG NHẬP VÀO HỆ THỐNG
   * @param {Object} credentials - Chứa email và password
   * @returns {Promise<any>} Thông tin đăng nhập và bộ đôi Token
   */
  login: async (credentials: { email: string; password: string }): Promise<any> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /** * ĐĂNG XUẤT VÀ DỌN DẸP DỮ LIỆU PHIÊN LÀM VIỆC
   * Đảm bảo xóa sạch Token trong LocalStorage dù API có lỗi hay không
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      // LUÔN LUÔN XÓA DỮ LIỆU Ở CLIENT SAU KHI LOGOUT
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /** * LẤY THÔNG TIN NGƯỜI DÙNG ĐANG ĐĂNG NHẬP
   * Xác thực dựa trên Access Token hiện có trong Header
   * @returns {Promise<{ success: boolean; data: UserInfo }>}
   */
  getCurrentUser: async (): Promise<{ success: boolean; data: UserInfo }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};