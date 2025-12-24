import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonLibraryApi } from '@/lib/services/lesson-admin';
import type { 
  CreateLibraryLessonRequest, 
  AssignLessonRequest 
} from '@/features/learning/lessons/types';
import { toast } from 'sonner';

// Query keys
export const lessonLibraryKeys = {
  all: ['lesson-library'] as const,
  lists: () => [...lessonLibraryKeys.all, 'list'] as const,
  unassigned: () => [...lessonLibraryKeys.all, 'unassigned'] as const,
  students: (lessonId: number) =>
    [...lessonLibraryKeys.all, 'students', lessonId] as const,
};

/**
 * Hook để lấy danh sách toàn bộ kho bài giảng
 */
export const useLessonLibrary = () => {
  return useQuery({
    queryKey: lessonLibraryKeys.lists(),
    queryFn: lessonLibraryApi.getAll,
  });
};

/**
 * Hook để lấy danh sách bài giảng chưa giao
 */
export const useUnassignedLessons = () => {
  return useQuery({
    queryKey: lessonLibraryKeys.unassigned(),
    queryFn: lessonLibraryApi.getUnassigned,
  });
};

/**
 * Hook để lấy danh sách học sinh đã được giao bài
 */
export const useLessonAssignedStudents = (lessonId: number) => {
  return useQuery({
    queryKey: lessonLibraryKeys.students(lessonId),
    queryFn: () => lessonLibraryApi.getAssignedStudents(lessonId),
    enabled: !!lessonId,
  });
};

/**
 * Hook để tạo bài giảng mới vào kho
 */
export const useCreateLibraryLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLibraryLessonRequest) => lessonLibraryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.unassigned() });
      toast.success('Tạo bài giảng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo bài giảng');
    },
  });
};

/**
 * Hook để giao bài giảng cho học sinh
 */
export const useAssignLibraryLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: number; data: AssignLessonRequest }) =>
      lessonLibraryApi.assign(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.students(variables.lessonId) });
      toast.success('Giao bài giảng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi giao bài giảng');
    },
  });
};

/**
 * Hook để thu hồi bài giảng
 */
export const useUnassignLibraryLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, data }: { lessonId: number; data: AssignLessonRequest }) =>
      lessonLibraryApi.unassign(lessonId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.students(variables.lessonId) });
      toast.success('Thu hồi bài giảng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi thu hồi bài giảng');
    },
  });
};

/**
 * Hook để xóa bài giảng khỏi kho
 */
export const useDeleteLibraryLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: number) => lessonLibraryApi.delete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: lessonLibraryKeys.unassigned() });
      toast.success('Xóa bài giảng thành công!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa bài giảng');
    },
  });
};