// ============================================================================
// FILE: admin-dashboard/types/dashboard.types.ts
// ============================================================================
export interface MonthlyChartData {
  month: string;
  total: number;
  paidPercentage: number;
  totalPaid: number;
  totalUnpaid: number;
}