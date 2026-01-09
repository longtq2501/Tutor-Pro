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

// Trong file định nghĩa types (ví dụ: @/types/dashboard.ts)
export interface DashboardStats {
  totalStudents: number;
  totalPaidAllTime: string;   // Dùng để hiển thị
  totalUnpaidAllTime: string; // Dùng để hiển thị
  currentMonthTotal: string;  // Dùng để hiển thị

  // THÊM 2 DÒNG NÀY ĐỂ TÍNH TOÁN PROGRESS BAR
  totalPaidRaw: number;
  totalUnpaidRaw: number;

  revenueTrendValue: number;
  revenueTrendDirection: 'up' | 'down';
  newStudentsCurrentMonth?: number;
}