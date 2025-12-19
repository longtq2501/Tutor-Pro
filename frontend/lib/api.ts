/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type {
  Student,
  StudentRequest,
  SessionRecord,
  SessionRecordRequest,
  DashboardStats,
  MonthlyStats,
  Document,
  DocumentCategory,
  DocumentStats,
  DocumentUploadRequest,
  InvoiceRequest,
  InvoiceResponse,
  Parent,
  ParentRequest,
  RecurringSchedule,
  RecurringScheduleRequest,
} from './types';

// 1. Lấy link gốc và xóa dấu gạch chéo ở cuối nếu có
const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const cleanBaseUrl = rawBaseUrl.replace(/\/$/, '');

// 2. Kiểm tra nếu link chưa có /api thì mới cộng thêm vào
const API_URL = cleanBaseUrl.endsWith('/api') 
    ? cleanBaseUrl 
    : `${cleanBaseUrl}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ THÊM DÒNG NÀY
});

// ============================================
// 🔐 TOKEN INTERCEPTORS
// ============================================

api.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/auth/')) {
      return config;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        }, {
          withCredentials: true // ✅ THÊM DÒNG NÀY
        });
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// 📝 API CODE
// ============================================

// Students API
export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await api.get('/students');
    return response.data;
  },
  getById: async (id: number): Promise<Student> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (data: StudentRequest): Promise<Student> => {
    const response = await api.post('/students', data);
    return response.data;
  },
  update: async (id: number, data: StudentRequest): Promise<Student> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/students/${id}`);
  },
  toggleActive: async (id: number): Promise<Student> => {
    const response = await api.put(`/students/${id}/toggle-active`);
    return response.data;
  },
};

// Sessions API
export const sessionsApi = {
  getAll: async (): Promise<SessionRecord[]> => {
    const response = await api.get('/sessions');
    return response.data;
  },
  getByMonth: async (month: string): Promise<SessionRecord[]> => {
    const response = await api.get(`/sessions/month/${month}`);
    return response.data;
  },
  getMonths: async (): Promise<string[]> => {
    const response = await api.get('/sessions/months');
    return response.data;
  },
  create: async (data: SessionRecordRequest): Promise<SessionRecord> => {
    const response = await api.post('/sessions', data);
    return response.data;
  },
  update: async (id: number, data: Partial<SessionRecordRequest>): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}`, data);
    return response.data;
  },
  togglePayment: async (id: number): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}/toggle-payment`);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
  getUnpaid: async (): Promise<SessionRecord[]> => {
    const response = await api.get('/sessions/unpaid');
    return response.data;
  },
  toggleCompleted: async (id: number): Promise<SessionRecord> => {
    const response = await api.put(`/sessions/${id}/toggle-completed`);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (currentMonth: string): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats', {
      params: { currentMonth }
    });
    return response.data;
  },
  getMonthlyStats: async (): Promise<MonthlyStats[]> => {
    const response = await api.get('/dashboard/monthly-stats');
    return response.data;
  },
};

export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
  },
  
  getById: async (id: number): Promise<Document> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  
  getByCategory: async (category: DocumentCategory): Promise<Document[]> => {
    const response = await api.get(`/documents/category/${category}`);
    return response.data;
  },
  
  search: async (keyword: string): Promise<Document[]> => {
    const response = await api.get('/documents/search', { params: { keyword } });
    return response.data;
  },
  
  upload: async (file: File, data: DocumentUploadRequest): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    const response = await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  // ✅ UPDATED: Now returns Cloudinary URL directly
  download: async (id: number): Promise<Blob> => {
    try {
      // Get Cloudinary URL from backend
      const response = await api.get(`/documents/${id}/download`);
      const cloudinaryUrl = response.data.url;
      
      // Fetch file from Cloudinary
      const fileResponse = await fetch(cloudinaryUrl);
      if (!fileResponse.ok) {
        throw new Error('Failed to download file from Cloudinary');
      }
      
      return await fileResponse.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
  
  downloadAndSave: async (id: number, filename: string): Promise<void> => {
    try {
      const blob = await documentsApi.download(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download and save error:', error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
  
  getStats: async (): Promise<DocumentStats> => {
    const response = await api.get('/documents/stats');
    return response.data;
  },
  
  getCategories: async (): Promise<DocumentCategory[]> => {
    const response = await api.get('/documents/categories');
    return response.data;
  },
  
  // ✅ UPDATED: Now returns Cloudinary URL directly
  getPreviewUrl: async (id: number): Promise<string> => {
    try {
      // Get Cloudinary URL from backend
      const response = await api.get(`/documents/${id}/preview`);
      const cloudinaryUrl = response.data.url;
      
      console.log('📄 Cloudinary preview URL:', cloudinaryUrl);
      
      // For PDF files, return Cloudinary URL directly
      // Cloudinary will serve the file properly
      return cloudinaryUrl;
      
    } catch (error) {
      console.error('Preview URL error:', error);
      throw error;
    }
  },
};

// Invoice API
export const invoicesApi = {
  generateInvoice: async (request: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await api.post('/invoices/generate', request);
    return response.data;
  },
  downloadInvoicePDF: async (request: InvoiceRequest): Promise<Blob> => {
    const response = await api.post('/invoices/download-pdf', request, {
      responseType: 'blob',
    });
    return response.data;
  },
  downloadMonthlyInvoicePDF: async (month: string): Promise<Blob> => {
    const response = await api.post('/invoices/download-monthly-pdf', null, {
      params: { month },
      responseType: 'blob',
    });
    return response.data;
  },
  downloadMonthlyInvoicePDFAlt: async (month: string): Promise<Blob> => {
    const response = await api.post('/invoices/download-pdf', {
      month,
      allStudents: true
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
  sendInvoiceEmail: async (request: InvoiceRequest): Promise<any> => {
    const response = await api.post('/invoices/send-email', request);
    return response.data;
  },
  sendInvoiceEmailBatch: async (request: InvoiceRequest): Promise<any> => {
    const response = await api.post('/invoices/send-email-batch', request);
    return response.data;
  },
  sendInvoiceEmailAll: async (request: InvoiceRequest): Promise<any> => {
    const response = await api.post('/invoices/send-email-all', request);
    return response.data;
  },
};

// Parents API
export const parentsApi = {
  getAll: async (): Promise<Parent[]> => {
    const response = await api.get('/parents');
    return response.data;
  },
  getById: async (id: number): Promise<Parent> => {
    const response = await api.get(`/parents/${id}`);
    return response.data;
  },
  create: async (data: ParentRequest): Promise<Parent> => {
    const response = await api.post('/parents', data);
    return response.data;
  },
  update: async (id: number, data: ParentRequest): Promise<Parent> => {
    const response = await api.put(`/parents/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/parents/${id}`);
  },
  search: async (keyword: string): Promise<Parent[]> => {
    const response = await api.get('/parents/search', { params: { keyword } });
    return response.data;
  },
};

// Recurring Schedules API
export const recurringSchedulesApi = {
  getAll: async (): Promise<RecurringSchedule[]> => {
    const response = await api.get('/recurring-schedules');
    return response.data;
  },
  getActive: async (): Promise<RecurringSchedule[]> => {
    const response = await api.get('/recurring-schedules/active');
    return response.data;
  },
  getById: async (id: number): Promise<RecurringSchedule> => {
    const response = await api.get(`/recurring-schedules/${id}`);
    return response.data;
  },
  getByStudentId: async (studentId: number): Promise<RecurringSchedule> => {
    const response = await api.get(`/recurring-schedules/student/${studentId}`);
    return response.data;
  },
  create: async (data: RecurringScheduleRequest): Promise<RecurringSchedule> => {
    const response = await api.post('/recurring-schedules', data);
    return response.data;
  },
  update: async (id: number, data: RecurringScheduleRequest): Promise<RecurringSchedule> => {
    const response = await api.put(`/recurring-schedules/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/recurring-schedules/${id}`);
  },
  toggleActive: async (id: number): Promise<RecurringSchedule> => {
    const response = await api.put(`/recurring-schedules/${id}/toggle-active`);
    return response.data;
  },
  generateSessions: async (month: string, studentIds?: number[]): Promise<any> => {
    const response = await api.post('/recurring-schedules/generate-sessions', {
      month,
      studentIds
    });
    return response.data;
  },
  checkMonth: async (month: string, studentId?: number): Promise<any> => {
    const response = await api.get('/recurring-schedules/check-month', {
      params: { month, studentId }
    });
    return response.data;
  },
  countSessions: async (month: string, studentIds?: number[]): Promise<any> => {
    const response = await api.post('/recurring-schedules/count-sessions', {
      month,
      studentIds
    });
    return response.data;
  },
};

// ============================================
// 🔑 AUTH SERVICE
// ============================================

export interface UserInfo {
  id: number;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'TUTOR' | 'STUDENT';
  studentId?: number; 
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<any> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  getCurrentUser: async (): Promise<{ success: boolean; data: UserInfo }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;