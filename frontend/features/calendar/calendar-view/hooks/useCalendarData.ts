// ============================================================================
// FILE: calendar-view/hooks/useCalendarData.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { sessionsApi, studentsApi } from '@/lib/services';
import type { SessionRecord, Student } from '@/lib/types';
import { getMonthStr } from '../utils';

export const useCalendarData = (currentDate: Date) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const monthStr = getMonthStr(currentDate);
      const [sessionsData, studentsData] = await Promise.all([
        sessionsApi.getByMonth(monthStr),
        studentsApi.getAll()
      ]);
      setSessions(sessionsData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  return { sessions, setSessions, students, loading, loadData };
};