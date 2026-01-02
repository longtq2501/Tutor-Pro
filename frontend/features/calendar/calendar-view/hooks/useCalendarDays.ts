// ============================================================================
// FILE: calendar-view/hooks/useCalendarDays.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';
import type { CalendarDay } from '../types';
import { getLocalDateStr } from '../utils';

export const useCalendarDays = (currentDate: Date, sessions: SessionRecord[]): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // 1. Pre-calculate Session Map for O(N+M) performance
  const sessionMap = sessions.reduce((acc, s) => {
    if (!acc[s.sessionDate]) acc[s.sessionDate] = [];
    acc[s.sessionDate].push(s);
    return acc;
  }, {} as Record<string, SessionRecord[]>);

  const days: CalendarDay[] = [];
  const iterator = new Date(startDate);
  iterator.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  while (iterator <= endDate) {
    const dateStr = getLocalDateStr(iterator);
    days.push({
      date: new Date(iterator),
      dateStr,
      sessions: sessionMap[dateStr] || [], // Direct lookup (O(1)) instead of .filter (O(M))
      isCurrentMonth: iterator.getMonth() === month,
      isToday: iterator.getTime() === today.getTime()
    });
    iterator.setDate(iterator.getDate() + 1);
  }
  return days;
};