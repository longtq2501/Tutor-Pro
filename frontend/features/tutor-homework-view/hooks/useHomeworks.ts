// ============================================================================
// 📁 tutor-homework-view/hooks/useHomeworks.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { homeworkApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Homework, HomeworkStats } from '@/lib/types';

export function useHomeworks(selectedStudent: number | null, isAdmin: boolean) {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedStudent) {
      loadHomeworks();
    }
  }, [selectedStudent]);

  const loadHomeworks = async () => {
    if (!selectedStudent) return;

    setLoading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      
      const [homeworkData, statsData] = await Promise.all([
        api.getStudentHomeworks(selectedStudent),
        api.getStudentStats(selectedStudent),
      ]);

      setHomeworks(homeworkData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load homeworks:', error);
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  const deleteHomework = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return;

    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      await api.delete(id);
      toast.success('Xóa bài tập thành công!');
      loadHomeworks();
    } catch (error) {
      console.error('Failed to delete homework:', error);
      toast.error('Không thể xóa bài tập');
    }
  };

  return { homeworks, stats, loading, loadHomeworks, deleteHomework };
}