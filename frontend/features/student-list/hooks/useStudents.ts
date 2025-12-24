// ============================================================================
// 📁 student-list/hooks/useStudents.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { studentsApi } from '@/lib/services';
import type { Student } from '@/lib/types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!confirm('CẢNH BÁO: Xóa học sinh sẽ xóa toàn bộ lịch sử học và doanh thu liên quan. Bạn có chắc chắn?')) {
      return;
    }
    try {
      await studentsApi.delete(id);
      await loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Không thể xóa học sinh!');
    }
  };

  return { students, loading, loadStudents, deleteStudent };
}
