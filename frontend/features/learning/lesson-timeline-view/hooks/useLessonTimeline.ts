// 📁 lesson-timeline-view/hooks/useLessonTimeline.ts
import { useQuery } from '@tanstack/react-query';
import { lessonsApi } from '@/lib/services';
import type { Lesson, LessonStats } from '@/lib/types';

// Import shared query keys for cache consistency
import { studentLessonKeys } from '@/features/learning/lesson-detail-view/hooks/useLessonDetail';

export function useLessonTimeline() {
  // Fetch lessons with shared query key
  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: studentLessonKeys.all,
    queryFn: lessonsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch stats separately
  const { data: stats = null, isLoading: loadingStats } = useQuery({
    queryKey: ['student-lesson-stats'],
    queryFn: lessonsApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loading = loadingLessons || loadingStats;

  return { lessons, stats, loading };
}
