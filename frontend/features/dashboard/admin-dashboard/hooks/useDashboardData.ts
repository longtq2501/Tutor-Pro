import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/services';
import type { DashboardStats, MonthlyStats } from '@/lib/types';

export const useDashboardData = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  // 1. Fetch Dashboard Stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard-stats', currentMonth],
    queryFn: () => dashboardApi.getStats(currentMonth),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // 2. Fetch Monthly Stats (Charts)
  const { data: monthlyStats, isLoading: loadingMonthly } = useQuery({
    queryKey: ['dashboard-monthly'],
    queryFn: () => dashboardApi.getMonthlyStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes (charts change less often)
    gcTime: 15 * 60 * 1000,
  });

  return {
    stats: stats || null,
    monthlyStats: monthlyStats || [],
    loading: loadingStats || loadingMonthly
  };
};