// ============================================================================
// 📁 unpaid-sessions/utils/groupSessions.ts
// ============================================================================
import type { SessionRecord } from '@/lib/types';

export interface StudentGroup {
  studentId: number;
  studentName: string;
  pricePerHour: number;
  sessions: SessionRecord[];
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  months: Set<string>;
}

export const groupSessionsByStudent = (records: SessionRecord[]): StudentGroup[] => {
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
        months: new Set<string>(),
      };
    }
    acc[key].sessions.push(record);
    acc[key].totalSessions += record.sessions;
    acc[key].totalHours += record.hours;
    acc[key].totalAmount += record.totalAmount;
    acc[key].months.add(record.month);
    return acc;
  }, {} as Record<number, StudentGroup>);

  return Object.values(grouped);
};