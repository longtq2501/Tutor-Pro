import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/lib/services';

// Query keys
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  detail: (id: number) => [...studentKeys.all, 'detail', id] as const,
};

import { Student } from '@/lib/types';

/**
 * Hook để lấy danh sách tất cả học sinh
 */
export const useStudents = () => {
  return useQuery<Student[]>({
    queryKey: studentKeys.lists(),  
    queryFn: async () => {
      const data = await studentsApi.getAll(0, 1000);
      return data.content;
    },
  });
};

/**
 * Hook để lấy chi tiết học sinh theo ID
 */
export const useStudentById = (id: number) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
};