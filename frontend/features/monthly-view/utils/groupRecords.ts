// 📁 monthly-view/utils/groupRecords.ts
import type { SessionRecord } from '@/lib/types';
import type { GroupedRecord } from '../types';

export function groupRecordsByStudent(records: SessionRecord[]): GroupedRecord[] {
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
      };
    }
    acc[key].sessions.push(record);
    acc[key].totalSessions += record.sessions;
    acc[key].totalHours += record.hours;
    acc[key].totalAmount += record.totalAmount;
    if (!record.paid) acc[key].allPaid = false;
    return acc;
  }, {} as Record<number, GroupedRecord>);

  return Object.values(grouped);
}

export function calculateTotalStats(records: SessionRecord[]) {
  return records.reduce((acc, r) => ({
    sessions: acc.sessions + r.sessions,
    paid: acc.paid + (r.paid ? r.totalAmount : 0),
    unpaid: acc.unpaid + (!r.paid ? r.totalAmount : 0)
  }), { sessions: 0, paid: 0, unpaid: 0 });
}

export function calculateSelectedStats(studentIds: number[], groupedRecords: Record<number, GroupedRecord>) {
  return studentIds.reduce((acc, id) => {
    const group = groupedRecords[id];
    if (group) {
      acc.totalSessions += group.totalSessions;
      acc.totalHours += group.totalHours;
      acc.totalAmount += group.totalAmount;
    }
    return acc;
  }, { totalSessions: 0, totalHours: 0, totalAmount: 0 });
}
