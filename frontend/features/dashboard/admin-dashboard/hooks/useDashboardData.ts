import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/services';
import type { DashboardStats, MonthlyStats } from '@/lib/types';

export const useDashboardData = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 1. Fetch Dashboard Stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats', currentMonth],
    queryFn: () => dashboardApi.getStats(currentMonth),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    initialData: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`dashboard-stats-${currentMonth}`);
        return saved ? JSON.parse(saved) : undefined;
      }
    }
  });

  // 2. Fetch Monthly Stats (Charts)
  const { data: monthlyStats, isLoading: loadingMonthly } = useQuery({
    queryKey: ['dashboard-monthly'],
    queryFn: () => dashboardApi.getMonthlyStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: keepPreviousData,
    initialData: () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('dashboard-monthly');
        return saved ? JSON.parse(saved) : undefined;
      }
    }
  });

  // Persist data to localStorage
  if (typeof window !== 'undefined') {
    if (stats) localStorage.setItem(`dashboard-stats-${currentMonth}`, JSON.stringify(stats));
    if (monthlyStats) localStorage.setItem('dashboard-monthly', JSON.stringify(monthlyStats));
  }

  return {
    stats: stats || null,
    monthlyStats: monthlyStats || [],
    loadingStats,
    loadingMonthly,
    loading: loadingStats || loadingMonthly
  };
};