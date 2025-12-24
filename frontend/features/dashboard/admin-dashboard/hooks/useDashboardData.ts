// ============================================================================
// FILE: admin-dashboard/hooks/useDashboardData.ts
// ============================================================================
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/services';
import type { DashboardStats, MonthlyStats } from '@/lib/types';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, monthlyData] = await Promise.all([
        dashboardApi.getStats(currentMonth),
        dashboardApi.getMonthlyStats(),
      ]);
      setStats(statsData);
      setMonthlyStats(monthlyData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, monthlyStats, loading };
};