// ============================================================================
// FILE: calendar-view/hooks/useCalendarStats.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';
import type { CalendarStats } from '../types';

export const useCalendarStats = (sessions: SessionRecord[]): CalendarStats => ({
  total: sessions.length,
  completed: sessions.filter(s => s.completed).length,
  scheduled: sessions.filter(s => !s.completed).length,
  revenue: sessions.reduce((sum, s) => sum + s.totalAmount, 0),
  pending: sessions.filter(s => !s.paid).length
});