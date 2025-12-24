// ============================================================================
// FILE: admin-dashboard/hooks/useMonthlyChartData.ts
// ============================================================================
import type { MonthlyStats } from '@/lib/types';
import type { MonthlyChartData } from '../types/dashboard.types';

export const useMonthlyChartData = (monthlyStats: MonthlyStats[]): MonthlyChartData[] => {
  return monthlyStats.slice(0, 6).map((month) => {
    const total = month.totalPaid + month.totalUnpaid;
    const paidPercentage = total > 0 ? (month.totalPaid / total) * 100 : 0;
    
    return {
      month: month.month,
      total,
      paidPercentage,
      totalPaid: month.totalPaid,
      totalUnpaid: month.totalUnpaid,
    };
  });
};