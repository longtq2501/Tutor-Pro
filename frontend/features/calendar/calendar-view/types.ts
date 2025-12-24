// ============================================================================
// FILE: calendar-view/types.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';

export interface CalendarDay {
  date: Date;
  dateStr: string;
  sessions: SessionRecord[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface CalendarStats {
  total: number;
  completed: number;
  scheduled: number;
  revenue: number;
  pending: number;
}