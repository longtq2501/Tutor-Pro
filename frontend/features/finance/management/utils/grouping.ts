import { SessionRecord } from '@/lib/types';
import { FinanceGroupedRecord } from '../types';

export const isTaughtSession = (record: SessionRecord) => {
  const isCancelled = record.status === 'CANCELLED_BY_STUDENT' || record.status === 'CANCELLED_BY_TUTOR';
  return !isCancelled && (record.status
    ? ['COMPLETED', 'PAID', 'PENDING_PAYMENT'].includes(record.status)
    : record.completed === true);
};

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

    // Financial totals only include sessions that have actually been taught.
    const isTaught = isTaughtSession(record);

    // Always add to the list so user can see history
    acc[key].sessions.push(record);
    acc[key].totalSessions += 1;

    if (isTaught) {
      acc[key].totalHours += record.hours || 0;
      acc[key].totalAmount += record.totalAmount || 0;

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
