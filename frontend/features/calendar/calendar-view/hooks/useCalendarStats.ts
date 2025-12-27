// ============================================================================
// FILE: calendar-view/hooks/useCalendarStats.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';
import type { CalendarStats } from '../types';

export const useCalendarStats = (sessions: SessionRecord[]): CalendarStats => {
  const activeSessions = sessions.filter(s => s.status !== 'CANCELLED_BY_STUDENT' && s.status !== 'CANCELLED_BY_TUTOR');

  return {
    total: activeSessions.length,
    completed: activeSessions.filter(s => s.completed || s.status === 'COMPLETED' || s.status === 'PAID' || s.status === 'PENDING_PAYMENT').length,
    scheduled: activeSessions.filter(s => !s.completed && s.status !== 'COMPLETED' && s.status !== 'PAID' && s.status !== 'PENDING_PAYMENT').length,
    revenue: activeSessions.reduce((sum, s) => sum + s.totalAmount, 0),
    pending: activeSessions.filter(s => !s.paid && s.status !== 'PAID').length
  };
};