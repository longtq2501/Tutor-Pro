// ============================================================================
// FILE: student-dashboard/types/dashboard.types.ts (UPDATED)
// ============================================================================

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
