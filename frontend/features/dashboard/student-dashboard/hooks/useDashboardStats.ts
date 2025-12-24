// ============================================================================
// FILE: student-dashboard/hooks/useDashboardStats.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';
import type { DashboardStats } from '../types/dashboard.types';

export const useDashboardStats = (sessions: SessionRecord[], currentMonth: string): DashboardStats => {
  const currentMonthSessions = sessions.filter(s => s.month === currentMonth);
  const totalHours = currentMonthSessions.reduce((sum, s) => sum + s.hours, 0);
  const totalAmount = currentMonthSessions.reduce((sum, s) => sum + s.totalAmount, 0);
  const paidAmount = currentMonthSessions.filter(s => s.paid).reduce((sum, s) => sum + s.totalAmount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const completedSessions = currentMonthSessions.filter(s => s.completed).length;
  const upcomingSessions = currentMonthSessions.filter(s => !s.completed);

  return {
    currentMonthSessions,
    totalHours,
    totalAmount,
    paidAmount,
    unpaidAmount,
    completedSessions,
    upcomingSessions,
  };
};