// src/lib/api.ts
import axios from 'axios';
import type {
  Student,
  StudentRequest,
  SessionRecord,
  SessionRecordRequest,
  DashboardStats,
  MonthlyStats,
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
  getAll: () => api.get<Student[]>('/students'),
  getById: (id: number) => api.get<Student>(`/students/${id}`),
  create: (data: StudentRequest) => api.post<Student>('/students', data),
  update: (id: number, data: StudentRequest) => api.put<Student>(`/students/${id}`, data),
  delete: (id: number) => api.delete(`/students/${id}`),
};

// Sessions API
export const sessionsApi = {
  getAll: () => api.get<SessionRecord[]>('/sessions'),
  getByMonth: (month: string) => api.get<SessionRecord[]>(`/sessions/month/${month}`),
  getMonths: () => api.get<string[]>('/sessions/months'),
  create: (data: SessionRecordRequest) => api.post<SessionRecord>('/sessions', data),
  togglePayment: (id: number) => api.put<SessionRecord>(`/sessions/${id}/toggle-payment`),
  delete: (id: number) => api.delete(`/sessions/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getStats: (currentMonth: string) => api.get<DashboardStats>('/dashboard/stats', {
    params: { currentMonth }
  }),
  getMonthlyStats: () => api.get<MonthlyStats[]>('/dashboard/monthly-stats'),
};

export default api;