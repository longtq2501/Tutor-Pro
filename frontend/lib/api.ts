/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import type {
  Student,
  StudentRequest,
  SessionRecord,
  SessionRecordRequest,
  DashboardStats,
  MonthlyStats,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  // THÊM: Hàm update chung để sửa completed, notes, v.v.
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

// Documents API
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
  download: async (id: number): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, { 
      responseType: 'blob' 
    });
    return response.data;
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
};

// Invoice API
export const invoicesApi = {
  generateInvoice: async (request: InvoiceRequest): Promise<InvoiceResponse> => {
    const response = await api.post('/invoices/generate', request);
    return response.data;
  },

  // Phương pháp 1: Dùng chung endpoint (như code hiện tại)
  downloadInvoicePDF: async (request: InvoiceRequest): Promise<Blob> => {
    const response = await api.post('/invoices/download-pdf', request, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Phương pháp 2: Endpoint riêng cho báo giá tổng (nếu backend có endpoint này)
  downloadMonthlyInvoicePDF: async (month: string): Promise<Blob> => {
    const response = await api.post('/invoices/download-monthly-pdf', null, {
      params: { month },
      responseType: 'blob',
    });
    return response.data;
  },

  // HOẶC dùng phương pháp 1 với allStudents flag
  downloadMonthlyInvoicePDFAlt: async (month: string): Promise<Blob> => {
    const response = await api.post('/invoices/download-pdf', {
      month,
      allStudents: true
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
  
  // ✅ Gửi email cho 1 học sinh
  sendInvoiceEmail: async (request: InvoiceRequest): Promise<{
    success: boolean;
    message: string;
    recipient?: string;
    parentName?: string;
    studentName?: string;
  }> => {
    const response = await api.post('/invoices/send-email', request);
    return response.data;
  },

  // ✅ Gửi email hàng loạt - TÊN ĐÚNG
  sendInvoiceEmailBatch: async (request: InvoiceRequest): Promise<{
    success: boolean;
    summary: {
      total: number;
      sent: number;
      failed: number;
    };
    successDetails: Array<{
      student: string;
      parent: string;
      email: string;
    }>;
    errors: string[];
  }> => {
    const response = await api.post('/invoices/send-email-batch', request);
    return response.data;
  },

  // ✅ Gửi email cho tất cả
  sendInvoiceEmailAll: async (request: InvoiceRequest): Promise<{
    success: boolean;
    summary: {
      total: number;
      sent: number;
      skipped: number;
      failed: number;
    };
    successDetails: Array<{
      student: string;
      parent: string;
      email: string;
    }>;
    errors: string[];
  }> => {
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
  
  // Auto-generate methods
  generateSessions: async (month: string, studentIds?: number[]): Promise<{
    success: boolean;
    month: string;
    sessionsCreated: number;
    message: string;
  }> => {
    const response = await api.post('/recurring-schedules/generate-sessions', {
      month,
      studentIds
    });
    return response.data;
  },
  
  checkMonth: async (month: string, studentId?: number): Promise<{
    month: string;
    hasSessions: boolean;
  }> => {
    const response = await api.get('/recurring-schedules/check-month', {
      params: { month, studentId }
    });
    return response.data;
  },
  
  countSessions: async (month: string, studentIds?: number[]): Promise<{
    month: string;
    count: number;
    message: string;
  }> => {
    const response = await api.post('/recurring-schedules/count-sessions', {
      month,
      studentIds
    });
    return response.data;
  },
};

export default api;