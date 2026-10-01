import type { SessionRecord } from '@/lib/types/finance';
import { isTaughtSession } from '@/features/finance/management/utils/grouping';

export type ReportScope = 'trung_tam' | 'day_rieng' | 'tat_ca';

export interface MonthlyFeeReportStudent {
  studentId: number;
  name: string;
  taughtSessions: number;
  cancelledSessions: number;
  totalHours: number;
  pricePerHour: number;
  amount: number;
  dates: Array<{ date: string; status: 'taught' | 'cancelled' }>;
}

export interface MonthlyFeeReportData {
  month: string;
  scope: ReportScope;
  students: MonthlyFeeReportStudent[];
  totalAmount: number;
  totalHours: number;
}

export function buildMonthlyFeeReport(sessions: SessionRecord[], date: Date, scope: ReportScope): MonthlyFeeReportData {
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const selected = sessions.filter((session) => {
    const source = session.nguon || 'trung_tam';
    const inScope = scope === 'tat_ca' || source === scope;
    return session.month === month && inScope;
  });

  const grouped = new Map<number, MonthlyFeeReportStudent>();
  for (const session of selected) {
    const cancelled = session.status === 'CANCELLED_BY_STUDENT';
    const taught = isTaughtSession(session);

    // Scheduled/confirmed sessions have no financial outcome yet and must not
    // appear as taught or cancelled in the monthly report.
    if (!taught && !cancelled) continue;

    const existing = grouped.get(session.studentId) || {
      studentId: session.studentId,
      name: session.studentName,
      taughtSessions: 0,
      cancelledSessions: 0,
      totalHours: 0,
      pricePerHour: session.pricePerHour || 0,
      amount: 0,
      dates: [],
    };
    if (cancelled) existing.cancelledSessions += 1;
    if (taught) {
      existing.taughtSessions += 1;
      existing.totalHours += session.hours || 0;
      existing.amount += (session.hours || 0) * (session.pricePerHour || existing.pricePerHour);
    }
    existing.dates.push({ date: session.sessionDate, status: cancelled ? 'cancelled' : 'taught' });
    grouped.set(session.studentId, existing);
  }

  const students = [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
  return {
    month,
    scope,
    students,
    totalAmount: students.reduce((sum, student) => sum + student.amount, 0),
    totalHours: students.reduce((sum, student) => sum + student.totalHours, 0),
  };
}
