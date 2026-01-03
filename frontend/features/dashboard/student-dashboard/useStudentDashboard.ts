import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from './hooks/useDashboardData';
import type { StudentDashboardStats } from './types/dashboard.types';

/**
 * Hook useStudentDashboard (Refactoring Specialist Edition)
 * 
 * Chức năng: Chuẩn bị dữ liệu sẵn sàng cho UI Dashboard của Sinh viên.
 * Luồng dữ liệu:
 * 1. Gọi useDashboardData để lấy dữ liệu thô từ Cache/API.
 * 2. Xử lý logic "Safe Stats" (Hệ thống giá trị mặc định khi đang load hoặc lỗi).
 * 3. Trả về dữ liệu đã được "làm sạch" cho index.tsx.
 */
export const useStudentDashboard = () => {
  const { user } = useAuth();
  const { 
    loading, 
    stats, 
    sessions, 
    documents, 
    schedule, 
    currentMonth, 
    setCurrentMonth 
  } = useDashboardData(user?.studentId);

  // === Logic safeStats (Rule #3 - Clean UI) ===
  // UI không cần quan tâm đến việc data bị undefined
  const safeStats: StudentDashboardStats = stats || {
    totalSessionsRaw: 0,
    completedSessionsRaw: 0,
    totalHoursRaw: 0,
    totalPaidRaw: 0,
    totalUnpaidRaw: 0,
    totalAmountRaw: 0,
    totalDocumentsRaw: 0,
    totalHoursFormatted: "0h",
    totalPaidFormatted: "0 đ",
    totalUnpaidFormatted: "0 đ",
    totalAmountFormatted: "0 đ",
    motivationalQuote: "Chào mừng trở lại! Hãy bắt đầu học tập nào.",
    showConfetti: false
  };

  return {
    user,
    loading: loading && !stats, // Chỉ loading khi chưa có dữ liệu (kể cả cache)
    stats: safeStats,
    sessions,
    documents,
    schedule,
    currentMonth,
    setCurrentMonth,
    hasStudentId: !!user?.studentId
  };
};
