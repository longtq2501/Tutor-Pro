// ============================================================================
// FILE: student-dashboard/index.tsx (MAIN COMPONENT)
// ============================================================================
'use client';

import { BookOpen, Clock, TrendingUp, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from './hooks/useDashboardData';
import { useDashboardStats } from './hooks/useDashboardStats';
import { formatCurrency } from './utils/formatters';
import { LoadingState } from './components/LoadingState';
import { UnlinkedAccountState } from './components/UnlinkedAccountState';
import { WelcomeSection } from './components/WelcomeSection';
import { StatCard } from './components/StatCard';
import { UpcomingSessionsSection } from './components/UpcomingSessionsSection';
import { ScheduleSection } from './components/ScheduleSection';
import { DocumentsSection } from './components/DocumentsSection';
import { ProgressSection } from './components/ProgressSection';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { loading, sessions, documents, schedule, currentMonth } = useDashboardData(user?.studentId);
  const stats = useDashboardStats(sessions, currentMonth);

  if (loading) return <LoadingState />;
  if (!user?.studentId) return <UnlinkedAccountState />;

  return (
    <div className="space-y-8">
      <WelcomeSection userName={user.fullName || ''} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Buổi Học Tháng Này"
          value={stats.currentMonthSessions.length}
          subtitle={`${stats.completedSessions} đã hoàn thành`}
          icon={<BookOpen className="text-blue-600 dark:text-blue-400" size={24} />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          hoverColor="group-hover:text-primary"
          progressPercent={
            stats.currentMonthSessions.length > 0 
              ? (stats.completedSessions / stats.currentMonthSessions.length) * 100 
              : 0
          }
        />

        <StatCard
          title="Tổng Số Giờ"
          value={`${stats.totalHours}h`}
          subtitle="Trong tháng này"
          icon={<Clock className="text-indigo-600 dark:text-indigo-400" size={24} />}
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30"
          iconColor="text-indigo-600 dark:text-indigo-400"
          hoverColor="group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
          badge={
            <div className="flex items-center text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 w-fit px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/30">
              <TrendingUp size={14} className="mr-1.5" /> Tiếp tục phát huy!
            </div>
          }
        />

        <StatCard
          title="Học Phí Tháng Này"
          value={formatCurrency(stats.totalAmount)}
          subtitle={
            stats.unpaidAmount > 0 
              ? `Còn nợ ${formatCurrency(stats.unpaidAmount)}` 
              : 'Đã thanh toán đầy đủ'
          }
          icon={
            stats.unpaidAmount > 0 
              ? <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
              : <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
          }
          iconBgColor={
            stats.unpaidAmount > 0 
              ? 'bg-orange-100 dark:bg-orange-900/30' 
              : 'bg-emerald-100 dark:bg-emerald-900/30'
          }
          iconColor={
            stats.unpaidAmount > 0 
              ? 'text-orange-600 dark:text-orange-400' 
              : 'text-emerald-600 dark:text-emerald-400'
          }
          hoverColor="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
          progressPercent={
            stats.totalAmount > 0 
              ? (stats.paidAmount / stats.totalAmount) * 100 
              : 100
          }
        />

        <StatCard
          title="Tài Liệu"
          value={documents.length}
          subtitle="Tài liệu có sẵn"
          icon={<FileText className="text-purple-600 dark:text-purple-400" size={24} />}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
          hoverColor="group-hover:text-purple-600 dark:group-hover:text-purple-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingSessionsSection sessions={stats.upcomingSessions} />
        
        <div className="space-y-6">
          {schedule && <ScheduleSection schedule={schedule} />}
          <DocumentsSection documents={documents} />
        </div>
      </div>

      {/* Progress */}
      <ProgressSection 
        completedSessions={stats.completedSessions}
        totalHours={stats.totalHours}
        totalSessions={stats.currentMonthSessions.length}
      />
    </div>
  );
}