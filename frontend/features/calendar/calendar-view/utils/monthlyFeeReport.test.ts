import { describe, expect, it } from 'vitest';
import type { SessionRecord } from '@/lib/types/finance';
import { buildMonthlyFeeReport } from './monthlyFeeReport';

const session = (overrides: Partial<SessionRecord>): SessionRecord => ({
  id: 1,
  studentId: 10,
  studentName: 'Lan',
  month: '2026-09',
  sessions: 1,
  hours: 1.5,
  pricePerHour: 200000,
  totalAmount: 300000,
  paid: false,
  sessionDate: '2026-09-03',
  hoursPerSession: 1.5,
  createdAt: '2026-09-03T00:00:00Z',
  status: 'COMPLETED',
  nguon: 'trung_tam',
  ...overrides,
});

describe('buildMonthlyFeeReport', () => {
  it('filters by source and excludes cancelled and upcoming sessions from fees', () => {
    const report = buildMonthlyFeeReport([
      session({}),
      session({ id: 2, nguon: 'day_rieng', studentId: 20, studentName: 'Minh' }),
      session({ id: 3, status: 'CANCELLED_BY_STUDENT', hours: 2 }),
      session({ id: 4, status: 'SCHEDULED', hours: 4 }),
    ], new Date(2026, 8, 1), 'trung_tam');

    expect(report.students).toHaveLength(1);
    expect(report.students[0]).toMatchObject({
      taughtSessions: 1,
      cancelledSessions: 1,
      totalHours: 1.5,
      amount: 300000,
    });
    expect(report.totalAmount).toBe(300000);
  });

  it('does not show scheduled or confirmed sessions as report results', () => {
    const report = buildMonthlyFeeReport([
      session({ status: 'SCHEDULED' }),
      session({ id: 2, status: 'CONFIRMED' }),
    ], new Date(2026, 8, 1), 'trung_tam');

    expect(report.students).toHaveLength(0);
    expect(report.totalAmount).toBe(0);
    expect(report.totalHours).toBe(0);
  });

  it('combines both sources for all scope', () => {
    const report = buildMonthlyFeeReport([
      session({}),
      session({ id: 2, nguon: 'day_rieng', studentId: 20, studentName: 'Minh' }),
    ], new Date(2026, 8, 1), 'tat_ca');

    expect(report.students).toHaveLength(2);
    expect(report.totalAmount).toBe(600000);
  });
});
