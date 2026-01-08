import { sessionsApi, studentsApi } from '@/lib/services';
import type { SessionRecord, Student } from '@/lib/types';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getMonthStr } from '../utils';

export const useCalendarData = (currentDate: Date) => {
  const queryClient = useQueryClient();
  const monthStr = getMonthStr(currentDate);

  // 1. Fetch Sessions with Cache
  const {
    data: sessionsData,
    isLoading: loadingSessions,
    isFetching: isFetchingSessions,
    isRefetching: isRefetchingSessions
  } = useQuery({
    queryKey: ['sessions', monthStr],
    queryFn: () => sessionsApi.getByMonth(monthStr),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep unused data for 10 minutes
    placeholderData: keepPreviousData,
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

  /**
   * Enhanced update function that handles both local state and TanStack Query Cache
   */
  const handleUpdateSession = (updated: SessionRecord) => {
    // 1. Update the local state for immediate UI feedback
    setSessions(prev => {
      const exists = prev.some(s => s.id === updated.id);
      if (exists) {
        return prev.map(s => s.id === updated.id ? updated : s);
      } else {
        // If it's a new session, prepend it
        return [updated, ...prev];
      }
    });

    // 2. Update the TanStack Query Cache (The Source of Truth)
    // This is CRITICAL to prevent useQuery from returning stale data during re-renders
    queryClient.setQueryData(['sessions', monthStr], (oldData: SessionRecord[] | undefined) => {
      if (!oldData) return undefined;
      const exists = oldData.some(s => s.id === updated.id);
      if (exists) {
        return oldData.map(s => s.id === updated.id ? updated : s);
      } else {
        return [updated, ...oldData];
      }
    });
  };

  // 5. Refresh function (Invalidate Cache)
  const loadData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['sessions', monthStr] });
    // Students usually don't change often, so we don't invalidate them eagerly
  };

  return {
    sessions,
    setSessions,
    updateSession: handleUpdateSession,
    students,
    loading: loadingSessions || loadingStudents,
    isFetching: isFetchingSessions,
    isRefetching: isRefetchingSessions,
    loadData
  };
};