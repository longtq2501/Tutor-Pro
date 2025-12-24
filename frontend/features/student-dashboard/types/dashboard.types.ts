
// ============================================================================
// FILE: student-dashboard/types/dashboard.types.ts

import { SessionRecord } from "@/lib/types";

// ============================================================================
export interface DashboardStats {
  currentMonthSessions: SessionRecord[];
  totalHours: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  completedSessions: number;
  upcomingSessions: SessionRecord[];
}