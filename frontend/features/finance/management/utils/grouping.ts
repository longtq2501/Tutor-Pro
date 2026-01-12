import { SessionRecord } from '@/lib/types';
import { FinanceGroupedRecord } from '../types';

export const groupSessionsByStudent = (records: SessionRecord[]): FinanceGroupedRecord[] => {
  if (!Array.isArray(records)) return [];
  const grouped = records.reduce((acc, record) => {
    const key = record.studentId;
    if (!acc[key]) {
      acc[key] = {
        studentId: record.studentId,
        studentName: record.studentName,
        pricePerHour: record.pricePerHour,
        sessions: [],
        totalSessions: 0,
        totalHours: 0,
        totalAmount: 0,
        allPaid: true,
        months: new Set<string>(),
      };
    }

    // Exclude CANCELLED sessions from financial totals
    const isCancelled = record.status === 'CANCELLED_BY_STUDENT' || record.status === 'CANCELLED_BY_TUTOR';

    // Always add to the list so user can see history
    acc[key].sessions.push(record);
    acc[key].totalSessions += 1;

    if (!isCancelled) {
      acc[key].totalHours += record.hours || 0;
      acc[key].totalAmount += record.totalAmount || 0;

      // Only count non-cancelled sessions towards "allPaid" behavior
      // A session is considered "unpaid" if it's NOT paid and meant to be paid (not cancelled)
      // We rely on record.paid boolean for simplicity, or we can check status === 'PAID'
      if (!record.paid) {
        acc[key].allPaid = false;
      }
    }

    if (record.month) {
      acc[key].months?.add(record.month);
    }

    return acc;
  }, {} as Record<number, FinanceGroupedRecord>);

  // Convert to array and sort groups by student name
  const result = Object.values(grouped).sort((a, b) => a.studentName.localeCompare(b.studentName));

  // Sort sessions within each group by date (Ascending)
  result.forEach(group => {
    group.sessions.sort((a, b) => {
      const dateA = new Date(a.sessionDate).getTime();
      const dateB = new Date(b.sessionDate).getTime();
      return dateA - dateB;
    });
  });

  return result;
};
