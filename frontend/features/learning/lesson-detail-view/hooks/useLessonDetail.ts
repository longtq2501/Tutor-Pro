// 📁 lesson-detail-view/hooks/useLessonDetail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Lesson } from '@/lib/types';
import type { LessonDTO } from '@/features/learning/lessons/types'; // Import DTO type

// Query keys for student lessons
export const studentLessonKeys = {
  all: ['student-lessons'] as const,
  detail: (id: number) => [...studentLessonKeys.all, id] as const,
};

export function useLessonDetail(lessonId: number, isPreview = false) {
  const queryClient = useQueryClient();

  // Fetch lesson data with React Query
  const { data: lesson, isLoading: loading } = useQuery({
    queryKey: isPreview ? ['admin-lesson-preview', lessonId] : studentLessonKeys.detail(lessonId),
    queryFn: async () => {
      // Dynamic import to avoid circular dependency if needed, or use separate service
      if (isPreview) {
        const mod = await import('@/lib/services/lesson-admin');
        const adminLesson = await mod.adminLessonsApi.getById(lessonId);

        // Map LessonDTO (Admin) to Lesson (Student View)
        const previewLesson: Lesson = {
          id: adminLesson.id,
          tutorName: adminLesson.tutorName,
          title: adminLesson.title,
          summary: adminLesson.summary,
          content: adminLesson.content,
          lessonDate: adminLesson.lessonDate,
          videoUrl: adminLesson.videoUrl,
          thumbnailUrl: adminLesson.thumbnailUrl,

          // Default values for preview mode (Admin viewing as Student)
          studentId: 0,
          studentName: 'Preview Mode',
          isCompleted: false,
          viewCount: 0,

          images: (adminLesson.images || []).map(img => ({
            id: img.id || 0,
            imageUrl: img.imageUrl,
            caption: img.caption,
            displayOrder: img.displayOrder || 0
          })),
          resources: (adminLesson.resources || []).map(res => ({
            id: res.id || 0,
            title: res.resourceName,
            description: '', // DTO doesn't have description
            resourceUrl: res.resourceUrl,
            resourceType: (res.resourceType as any) || 'DOCUMENT',
            fileSize: res.fileSize,
            displayOrder: 0
          })),
          createdAt: adminLesson.createdAt,
          updatedAt: adminLesson.updatedAt,
          category: adminLesson.category,
        };
        return previewLesson;
      }
      return lessonsApi.getById(lessonId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Auto-refresh when tab gains focus
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

      // Invalidate lesson list to update badges
      queryClient.invalidateQueries({ queryKey: studentLessonKeys.all });

      // Invalidate course caches to update progress immediately
      queryClient.invalidateQueries({ queryKey: ['my-courses'] });
      queryClient.invalidateQueries({ queryKey: ['student-course-detail'] });

      toast.success(
        updatedLesson.isCompleted
          ? '✅ Đã đánh dấu hoàn thành! Tiến độ khóa học đã được cập nhật.'
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
