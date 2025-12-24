// 📁 monthly-view/types.ts
import type { SessionRecord } from '@/lib/types';

export interface GroupedRecord {
  studentId: number;
  studentName: string;
  pricePerHour: number;
  sessions: SessionRecord[];
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  allPaid: boolean;
}