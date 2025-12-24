// 📁 lesson-detail-view/hooks/useLessonDetail.ts
import { useState, useEffect } from 'react';
import { lessonsApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Lesson } from '@/lib/types';

export function useLessonDetail(lessonId: number) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    try {
      const data = await lessonsApi.getById(lessonId);
      setLesson(data);
    } catch (error: any) {
      console.error('Failed to load lesson:', error);
      toast.error('Không thể tải bài học');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async () => {
    if (!lesson) return;

    setMarkingComplete(true);
    try {
      const updated = lesson.isCompleted
        ? await lessonsApi.markIncomplete(lessonId)
        : await lessonsApi.markCompleted(lessonId);

      setLesson(updated);
      toast.success(updated.isCompleted ? '✅ Đã đánh dấu hoàn thành!' : '❌ Đã bỏ đánh dấu');
    } catch (error: any) {
      console.error('Failed to toggle completion:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setMarkingComplete(false);
    }
  };

  return { lesson, loading, markingComplete, toggleComplete };
}