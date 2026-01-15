import api from './axios-instance';
import type { PageResponse } from '../types/common';
import { Tutor, TutorRequest, TutorStats } from '@/lib/types/tutor';  


export const tutorsApi = {
  /**
   * Get all tutors with pagination and filters
   */
  getAll: async (
    page = 0,
    size = 10,
    search = '',
    status = ''
  ): Promise<PageResponse<Tutor>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) params.append('search', search);
    if (status) params.append('status', status);

    const response = await api.get(`/admin/tutors?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get tutor by ID
   */
  getById: async (id: number): Promise<Tutor> => {
    const response = await api.get(`/admin/tutors/${id}`);
    return response.data.data;
  },

  /**
   * Create new tutor
   */
  create: async (data: TutorRequest): Promise<Tutor> => {
    const response = await api.post('/admin/tutors', data);
    return response.data.data;
  },

  /**
   * Update existing tutor
   */
  update: async (id: number, data: TutorRequest): Promise<Tutor> => {
    const response = await api.put(`/admin/tutors/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete tutor
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/tutors/${id}`);
  },

  /**
   * Get tutor statistics
   */
  getStats: async (id: number): Promise<TutorStats> => {
    const response = await api.get(`/admin/tutors/${id}/stats`);
    return response.data.data;
  },
};


export type { TutorRequest, Tutor, TutorStats };

