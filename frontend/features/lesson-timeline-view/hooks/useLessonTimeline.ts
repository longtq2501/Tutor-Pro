// 📁 lesson-timeline-view/hooks/useLessonTimeline.ts
import { useState, useEffect } from 'react';
import { lessonsApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Lesson, LessonStats } from '@/lib/types';

export function useLessonTimeline() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [stats, setStats] = useState<LessonStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lessonsData, statsData] = await Promise.all([
        lessonsApi.getAll(),
        lessonsApi.getStats(),
      ]);
      setLessons(lessonsData);
      setStats(statsData);
    } catch (error: any) {
      console.error('Failed to load lessons:', error);
      toast.error('Không thể tải danh sách bài học');
    } finally {
      setLoading(false);
    }
  };

  return { lessons, stats, loading };
}
