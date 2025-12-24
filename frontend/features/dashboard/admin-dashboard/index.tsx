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
import { MonthlyRevenueChart } from './components/MonthlyRevenueChart';

export default function AdminDashboard() {
  const { stats, monthlyStats, loading } = useDashboardData();
  const chartData = useMonthlyChartData(monthlyStats);

  if (loading) return <LoadingState />;
  if (!stats) return null;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
        
        {/* Total Students */}
        <StatCard
          title="Tổng Học Sinh"
          value={stats.totalStudents}
          icon={<Users className="text-indigo-600 dark:text-indigo-400" size={20} />}
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
          valueColorClass="group-hover:text-primary"
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
          value={formatCurrency(stats.currentMonthTotal)}
          subtitle="Cập nhật thời gian thực"
          icon={<BarChart3 className="text-blue-600 dark:text-blue-400" size={20} />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          valueColorClass="group-hover:text-blue-600 dark:group-hover:text-blue-400"
        />

        {/* Total Paid */}
        <StatCard
          title="Tổng Đã Thu"
          value={formatCurrency(stats.totalPaidAllTime)}
          icon={<CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />}
          iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
          valueColorClass="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
          progressBar={{
            percentage: 75,
            color: 'bg-emerald-500 dark:bg-emerald-500'
          }}
        />

        {/* Total Unpaid */}
        <StatCard
          title="Chưa Thu"
          value={formatCurrency(stats.totalUnpaidAllTime)}
          icon={<XCircle className="text-rose-600 dark:text-rose-400" size={20} />}
          iconBgColor="bg-rose-100 dark:bg-rose-900/30"
          valueColorClass="group-hover:text-destructive"
          progressBar={{
            percentage: 25,
            color: 'bg-rose-500 dark:bg-rose-500'
          }}
        />
      </div>

      {/* Monthly Revenue Chart */}
      <MonthlyRevenueChart data={chartData} />
    </div>
  );
}