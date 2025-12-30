// ============================================================================
// FILE: admin-dashboard/index.tsx (MAIN COMPONENT)
// ============================================================================
'use client';

import { Users, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { useDashboardData } from './hooks/useDashboardData';
import { useMonthlyChartData } from './hooks/useMonthlyChartData';
import { formatCurrency } from './utils/formatters';
import { LoadingState } from './components/LoadingState';
import { StatCard } from './components/StatCard';
import { EnhancedRevenueChart } from './components/EnhancedRevenueChart';

export default function AdminDashboard() {
  const { stats, monthlyStats, loadingStats, loadingMonthly } = useDashboardData();
  const chartData = useMonthlyChartData(monthlyStats);

  // Default stats to prevent crash when loading
  const safeStats = stats || {
    totalStudents: 0,
    currentMonthTotal: 0,
    totalPaidAllTime: 0,
    totalUnpaidAllTime: 0
  };

  // Calculate trends from monthly data
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return undefined;
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      value: Math.abs(Math.round(change))
    } as const;
  };

  // Get current and previous month data for trends
  const currentMonthData = monthlyStats[0];
  const previousMonthData = monthlyStats[1];

  const revenueTrend = currentMonthData && previousMonthData
    ? calculateTrend(
      currentMonthData.totalPaid + currentMonthData.totalUnpaid,
      previousMonthData.totalPaid + previousMonthData.totalUnpaid
    )
    : undefined;

  // Calculate progress percentages
  const totalAllTime = safeStats.totalPaidAllTime + safeStats.totalUnpaidAllTime;
  const paidPercentage = totalAllTime > 0 ? Math.round((safeStats.totalPaidAllTime / totalAllTime) * 100) : 0;
  const unpaidPercentage = totalAllTime > 0 ? Math.round((safeStats.totalUnpaidAllTime / totalAllTime) * 100) : 0;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

        {/* Total Students */}
        <StatCard
          title="Tổng Học Sinh"
          value={safeStats.totalStudents}
          icon={<Users />}
          variant="blue"
          isLoading={loadingStats}
          badge={
            <div className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 w-fit px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/30">
              <TrendingUp size={12} className="mr-1 flex-shrink-0" />
              <span className="whitespace-nowrap">Đang hoạt động</span>
            </div>
          }
        />

        {/* Revenue This Month */}
        <StatCard
          title="Doanh Thu Tháng"
          value={formatCurrency(safeStats.currentMonthTotal)}
          subtitle="Cập nhật thời gian thực"
          icon={<BarChart3 />}
          variant="blue"
          trend={revenueTrend}
          isLoading={loadingStats}
        />

        {/* Total Paid */}
        <StatCard
          title="Tổng Đã Thu"
          value={formatCurrency(safeStats.totalPaidAllTime)}
          icon={<CheckCircle />}
          variant="green"
          progressBar={{
            percentage: paidPercentage,
            color: 'green'
          }}
          isLoading={loadingStats}
        />

        {/* Total Unpaid */}
        <StatCard
          title="Chưa Thu"
          value={formatCurrency(safeStats.totalUnpaidAllTime)}
          icon={<XCircle />}
          variant="red"
          progressBar={{
            percentage: unpaidPercentage,
            color: 'red'
          }}
          isLoading={loadingStats}
        />
      </div>

      {/* Enhanced Revenue Chart */}
      <EnhancedRevenueChart
        data={chartData}
        isLoading={loadingMonthly}
      />
    </div>
  );
}