// ============================================================================
// 📁 tutor-homework-detail/hooks/useGrading.ts
// ============================================================================
import { useState } from 'react';
import { homeworkApi } from '@/lib/services';
import { toast } from 'sonner';
import type { Homework } from '@/lib/types';

export function useGrading(homework: Homework, isAdmin: boolean, onUpdate: () => void) {
  const [gradingMode, setGradingMode] = useState(false);
  const [score, setScore] = useState<number>(homework.score || 0);
  const [feedback, setFeedback] = useState(homework.feedback || '');
  const [grading, setGrading] = useState(false);

  const handleGrade = async () => {
    if (score < 0 || score > 100) {
      toast.error('Điểm phải từ 0 đến 100');
      return;
    }

    setGrading(true);
    try {
      const api = isAdmin ? homeworkApi.admin : homeworkApi.tutor;
      await api.grade(homework.id, score, feedback);
      
      toast.success('Chấm điểm thành công!');
      setGradingMode(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to grade homework:', error);
      toast.error('Không thể chấm điểm');
    } finally {
      setGrading(false);
    }
  };

  const startEdit = () => {
    setScore(homework.score || 0);
    setFeedback(homework.feedback || '');
    setGradingMode(true);
  };

  return {
    gradingMode,
    score,
    setScore,
    feedback,
    setFeedback,
    grading,
    handleGrade,
    startEdit,
    setGradingMode,
  };
}