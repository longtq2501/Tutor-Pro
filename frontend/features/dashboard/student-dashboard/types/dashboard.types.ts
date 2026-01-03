// ============================================================================
import type { SessionRecord } from '@/lib/types';

export interface StudentDashboardStats {
    // RAW DATA
    totalSessionsRaw: number;
    completedSessionsRaw: number;
    totalHoursRaw: number;
    totalPaidRaw: number;
    totalUnpaidRaw: number;
    totalAmountRaw: number;
    totalDocumentsRaw: number;

    // FORMATTED DATA
    totalHoursFormatted: string;
    totalPaidFormatted: string;
    totalUnpaidFormatted: string;
    totalAmountFormatted: string;

    // GAMIFICATION
    motivationalQuote: string;
    showConfetti: boolean;
}

export interface DashboardStats {
    currentMonthSessions: SessionRecord[];
    totalHours: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    completedSessions: number;
    upcomingSessions: SessionRecord[];
}
