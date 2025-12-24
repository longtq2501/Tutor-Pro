// ============================================================================
// 📁 tutor-homework-view/hooks/useStudents.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { studentsApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Student } from '@/lib/types';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsApi.getAll();
      const activeStudents = data.filter(s => s.active);
      setStudents(activeStudents);
      if (activeStudents.length > 0) {
        setSelectedStudent(activeStudents[0].id);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
      toast.error('Không thể tải danh sách học sinh');
    }
  };

  return { students, selectedStudent, setSelectedStudent };
}