import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionsApi, studentsApi } from '@/lib/services';
import type { SessionRecord, Student } from '@/lib/types';
import { getMonthStr } from '../utils';

export const useCalendarData = (currentDate: Date) => {
  const queryClient = useQueryClient();
  const monthStr = getMonthStr(currentDate);

  // 1. Fetch Sessions with Cache
  const {
    data: sessionsData,
    isLoading: loadingSessions,
    isRefetching: isRefetchingSessions
  } = useQuery({
    queryKey: ['sessions', monthStr],
    queryFn: () => sessionsApi.getByMonth(monthStr),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
  });

  // 2. Fetch Students with Cache (longer stale time)
  const {
    data: studentsData,
    isLoading: loadingStudents
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => studentsApi.getAll(),
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });

  // 3. Local state for optimistic updates compatibility
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // 4. Sync Server Data to Local State
  useEffect(() => {
    if (sessionsData) {
      setSessions(sessionsData);
    }
  }, [sessionsData]);

  useEffect(() => {
    if (studentsData) {
      setStudents(studentsData);
    }
  }, [studentsData]);

  // 5. Refresh function (Invalidate Cache)
  const loadData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['sessions', monthStr] });
    // Students usually don't change often, so we don't invalidate them eagerly
  };

  return {
    sessions,
    setSessions,
    students,
    loading: loadingSessions || loadingStudents,
    isRefetching: isRefetchingSessions,
    loadData
  };
};