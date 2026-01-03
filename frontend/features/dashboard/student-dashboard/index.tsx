// ============================================================================
// FILE: student-dashboard/index.tsx (STUDENT DELIGHT EDITION - REFINED)
// ============================================================================
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Clock, FileText, Sparkles } from 'lucide-react';
import { DocumentsSection } from './components/DocumentsSection';
import { LoadingState } from './components/LoadingState';
import { MonthlySessionsList } from './components/MonthlySessionsList';
import { ProgressSection } from './components/ProgressSection';
import { ScheduleSection } from './components/ScheduleSection';
import { StatCard } from './components/StatCard';
import { UnlinkedAccountState } from './components/UnlinkedAccountState';
import { WelcomeSection } from './components/WelcomeSection';
import { useDashboardData } from './hooks/useDashboardData';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { loading, stats, sessions, documents, schedule, currentMonth, setCurrentMonth } = useDashboardData(user?.studentId);

  // Use values from stats or default to 0
  const safeStats = stats || {
    totalSessionsRaw: 0,
    completedSessionsRaw: 0,
    totalHoursRaw: 0,
    totalPaidRaw: 0,
    totalUnpaidRaw: 0,
    totalAmountRaw: 0,
    totalDocumentsRaw: 0,
    totalHoursFormatted: "0h",
    totalPaidFormatted: "0 đ",
    totalUnpaidFormatted: "0 đ",
    totalAmountFormatted: "0 đ",
    motivationalQuote: "Chào mừng trở lại! Hãy bắt đầu học tập nào.",
    showConfetti: false
  };

  if (loading && !stats) return <LoadingState />;
  if (!user?.studentId) return <UnlinkedAccountState />;

  return (
    <div className="space-y-8 relative">
      {/* Confetti / Success Overlay */}
      <AnimatePresence>
        {safeStats.showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-10 z-50 pointer-events-none"
          >
            <div className="bg-yellow-400/20 p-4 rounded-full backdrop-blur-md border border-yellow-400/50 flex items-center gap-2 text-yellow-600 dark:text-yellow-300 font-bold shadow-xl">
              <Sparkles className="animate-spin-slow" />
              <span>Tuyệt vời! Đã hoàn thành mục tiêu tháng!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WelcomeSection
        userName={user.fullName || ''}
        quote={safeStats.motivationalQuote}
      />

      {/* Stats Grid - REMOVED FINANCE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Buổi Học Tháng Này"
          value={safeStats.totalSessionsRaw}
          subtitle={`${safeStats.completedSessionsRaw} buổi đã hoàn thành`}
          icon={<BookOpen className="text-white" size={24} />}
          variant="blue"
          progressBar={{
            percentage: safeStats.totalSessionsRaw > 0
              ? (safeStats.completedSessionsRaw / safeStats.totalSessionsRaw) * 100
              : 0,
            color: 'blue'
          }}
        />

        <StatCard
          title="Tổng Số Giờ"
          value={safeStats.totalHoursFormatted}
          subtitle="Thời gian học tháng này"
          icon={<Clock className="text-white" size={24} />}
          variant="indigo"
          badge={
            <div className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
              Tháng {currentMonth.split('-')[1]}
            </div>
          }
        />

        <StatCard
          title="Tài Liệu"
          value={documents.length}
          subtitle="Tài liệu học tập"
          icon={<FileText className="text-white" size={24} />}
          variant="purple"
        />
      </div>

      {/* Main Content - UPDATED SESSIONS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MonthlySessionsList
            sessions={sessions}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            isLoading={loading}
          />
        </div>

        <div className="space-y-6">
          {schedule && <ScheduleSection schedule={schedule} />}
          <DocumentsSection documents={documents.slice(0, 4)} />
        </div>
      </div>

      {/* Progress Section */}
      <ProgressSection
        completedSessions={safeStats.completedSessionsRaw}
        totalHours={safeStats.totalHoursRaw}
        totalSessions={safeStats.totalSessionsRaw}
      />
    </div>
  );
}