// 📁 lesson-detail-view/hooks/useLessonDetail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Lesson } from '@/lib/types';

// Query keys for student lessons
export const studentLessonKeys = {
  all: ['student-lessons'] as const,
  detail: (id: number) => [...studentLessonKeys.all, id] as const,
};

export function useLessonDetail(lessonId: number) {
  const queryClient = useQueryClient();

  // Fetch lesson data with React Query
  const { data: lesson, isLoading: loading } = useQuery({
    queryKey: studentLessonKeys.detail(lessonId),
    queryFn: () => lessonsApi.getById(lessonId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for toggling completion status
  const { mutate: toggleComplete, isPending: markingComplete } = useMutation({
    mutationFn: async () => {
      if (!lesson) throw new Error('No lesson data');

      return lesson.isCompleted
        ? lessonsApi.markIncomplete(lessonId)
        : lessonsApi.markCompleted(lessonId);
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentLessonKeys.detail(lessonId) });

      // Snapshot previous value
      const previousLesson = queryClient.getQueryData<Lesson>(studentLessonKeys.detail(lessonId));

      // Optimistically update UI
      if (previousLesson) {
        queryClient.setQueryData<Lesson>(studentLessonKeys.detail(lessonId), {
          ...previousLesson,
          isCompleted: !previousLesson.isCompleted,
          completedAt: !previousLesson.isCompleted ? new Date().toISOString() : previousLesson.completedAt,
        });
      }

      return { previousLesson };
    },
    onSuccess: (updatedLesson) => {
      // Update cache with backend response to prevent revert
      queryClient.setQueryData<Lesson>(studentLessonKeys.detail(lessonId), updatedLesson);

      // Invalidate list to update badges
      queryClient.invalidateQueries({ queryKey: studentLessonKeys.all });

      toast.success(
        updatedLesson.isCompleted
          ? '✅ Đã đánh dấu hoàn thành!'
          : '❌ Đã bỏ đánh dấu'
      );
    },
    onError: (error: any, _, context) => {
      // Rollback on error
      if (context?.previousLesson) {
        queryClient.setQueryData(studentLessonKeys.detail(lessonId), context.previousLesson);
      }
      console.error('Failed to toggle completion:', error);
      toast.error('Không thể cập nhật trạng thái');
    },
  });

  return { lesson: lesson ?? null, loading, markingComplete, toggleComplete };
}
