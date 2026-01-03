// ============================================================================
// FILE: student-dashboard/hooks/useDashboardData.ts (OPTIMIZED)
// ============================================================================
import { api, dashboardApi, documentsApi, recurringSchedulesApi } from '@/lib/services';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const useDashboardData = (studentId: number | undefined) => {
  // Use state for current month to allow toggling
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // 1. Fetch Stats (Cache-First)
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['student-stats', studentId, currentMonth],
    queryFn: () => dashboardApi.getStudentStats(studentId!, currentMonth),
    enabled: !!studentId,
    placeholderData: keepPreviousData,
    initialData: () => {
        if (typeof window !== 'undefined' && studentId) {
            const saved = localStorage.getItem(`student-stats-${studentId}-${currentMonth}`);
            return saved ? JSON.parse(saved) : undefined;
        }
        return undefined;
    },
    staleTime: 0, // Always check for updates
    refetchOnWindowFocus: true,
  });

  // 2. Fetch Sessions List (Dynamic based on selected month)
  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['student-sessions', studentId, currentMonth],
    queryFn: () => api.get(`/student/sessions?month=${currentMonth}`).then(res => res.data),
    enabled: !!studentId,
    refetchOnWindowFocus: true, // Ensure we refetch when user switches back to tab
  });

  // 3. Fetch Documents
  const { data: documents, isLoading: loadingDocs } = useQuery({
    queryKey: ['student-documents', studentId],
    queryFn: async () => {
        const allDocs = await documentsApi.getAll();
        return allDocs.filter((doc: any) => !doc.studentId || doc.studentId === studentId);
    },
    enabled: !!studentId,
  });

  // 4. Fetch Schedule
  const { data: schedule } = useQuery({
    queryKey: ['student-schedule', studentId],
    queryFn: () => recurringSchedulesApi.getByStudentId(studentId!),
    enabled: !!studentId,
    retry: false,
  });

  // Persist Stats to LocalStorage
  useEffect(() => {
    if (stats && studentId) {
        localStorage.setItem(`student-stats-${studentId}-${currentMonth}`, JSON.stringify(stats));
    }
  }, [stats, studentId, currentMonth]);

  const loading = loadingStats || loadingSessions || loadingDocs;

  return { 
      loading, 
      stats, 
      sessions: sessions || [], 
      documents: documents || [], 
      schedule, 
      currentMonth,
      setCurrentMonth // Exposed setter
  };
};