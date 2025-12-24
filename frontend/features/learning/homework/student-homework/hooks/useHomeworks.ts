// ============================================================================
// 📁 student-homework/hooks/useHomeworks.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { homeworkApi } from '@/lib/services';
import type { Homework, HomeworkStats } from '@/lib/types';

export function useHomeworks() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [stats, setStats] = useState<HomeworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    loadData();
  }, [selectedTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await homeworkApi.student.getStats();
      setStats(statsData);

      let homeworkData: Homework[];
      switch (selectedTab) {
        case 'upcoming':
          homeworkData = await homeworkApi.student.getUpcoming(7);
          break;
        case 'overdue':
          homeworkData = await homeworkApi.student.getOverdue();
          break;
        case 'completed':
          const submitted = await homeworkApi.student.getByStatus('SUBMITTED');
          const graded = await homeworkApi.student.getByStatus('GRADED');
          homeworkData = [...submitted, ...graded];
          break;
        default:
          homeworkData = await homeworkApi.student.getAll();
      }

      setHomeworks(homeworkData);
    } catch (error) {
      console.error('Failed to load homeworks:', error);
    } finally {
      setLoading(false);
    }
  };

  return { homeworks, stats, loading, selectedTab, setSelectedTab, loadData };
}