package com.tutor_management.backend.modules.dashboard;

import java.util.List;
import java.time.YearMonth;
import java.time.LocalDateTime;

import com.tutor_management.backend.modules.dashboard.dto.response.StudentDashboardStats;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.LessonStatus;
import com.tutor_management.backend.modules.finance.repository.SessionRecordRepository;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.student.repository.StudentRepository;
import com.tutor_management.backend.modules.document.repository.DocumentRepository;
import com.tutor_management.backend.util.FormatterUtils;

import lombok.RequiredArgsConstructor;

/**
 * Service for calculating and aggregating dashboard metrics.
 * Provides separate logic for tutor/admin and student dashboards.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final DocumentRepository documentRepository;

    /**
     * Retrieves overall system statistics for a specific month.
     * Includes all-time totals, monthly totals, revenue trends, and new student growth.
     * 
     * @param currentMonth The month to query (YYYY-MM format)
     * @return DashboardStats containing aggregated metrics
     */
    @Cacheable(value = "dashboardStats", key = "#currentMonth")
    public DashboardStats getDashboardStats(String currentMonth) {
        // 1. Fetch raw financial summary from repository
        DashboardStats stats = sessionRecordRepository.getFinanceSummary(currentMonth);
        if (stats == null) {
            stats = new DashboardStats(0, 0L, 0L, 0L, 0L);
        }

        // 2. Format currencies for display
        stats.setTotalPaidAllTime(FormatterUtils.formatCurrency(stats.getTotalPaidRaw()));
        stats.setTotalUnpaidAllTime(FormatterUtils.formatCurrency(stats.getTotalUnpaidRaw()));
        stats.setCurrentMonthTotal(FormatterUtils.formatCurrency(stats.getCurrentMonthTotalRaw()));

        // 3. Calculate revenue growth trend compared to previous month
        calculateRevenueTrend(stats);

        // 4. Calculate new student signups for the current month
        calculateNewStudentGrowth(stats, currentMonth);

        return stats;
    }

    private void calculateRevenueTrend(DashboardStats stats) {
        List<MonthlyStats> monthlyList = sessionRecordRepository.findAllMonthlyStatsAggregated();
        if (monthlyList.size() >= 2) {
            long currentRevenue = monthlyList.get(0).getTotalPaid() + monthlyList.get(0).getTotalUnpaid();
            long previousRevenue = monthlyList.get(1).getTotalPaid() + monthlyList.get(1).getTotalUnpaid();
            
            if (previousRevenue > 0) {
                double growthPercentage = ((double) (currentRevenue - previousRevenue) / previousRevenue) * 100;
                stats.setRevenueTrendValue(Math.abs(Math.round(growthPercentage * 10.0) / 10.0));
                stats.setRevenueTrendDirection(growthPercentage >= 0 ? "up" : "down");
            }
        }
    }

    private void calculateNewStudentGrowth(DashboardStats stats, String monthStr) {
        try {
            YearMonth yearMonth = YearMonth.parse(monthStr);
            LocalDateTime monthStart = yearMonth.atDay(1).atStartOfDay();
            LocalDateTime monthEnd = yearMonth.atEndOfMonth().atTime(23, 59, 59);
            stats.setNewStudentsCurrentMonth((int) studentRepository.countByCreatedAtBetween(monthStart, monthEnd));
        } catch (Exception e) {
            stats.setNewStudentsCurrentMonth(0);
        }
    }

    /**
     * Retrieves personalized dashboard stats for a student.
     * Includes attendance tracking, financial state, and motivational feedback.
     * 
     * @param studentId Primary ID of the student
     * @param month The month to query (YYYY-MM format)
     * @return StudentDashboardStats for the specified user and period
     */
    public StudentDashboardStats getStudentDashboardStats(Long studentId, String month) {
        // 1. Fetch session records and shared documents
        var records = sessionRecordRepository.findByStudentIdAndMonth(studentId, month);
        int documentCount = documentRepository.countByStudentIdOrStudentIsNull(studentId).intValue();

        // 2. Aggregate metrics in memory
        int totalSessions = 0;
        int completedSessions = 0;
        double totalHours = 0.0;
        long totalPaid = 0;
        long totalUnpaid = 0;
        long totalAmount = 0;

        for (var record : records) {
            if (isCancelled(record.getStatus())) {
                continue;
            }

            totalSessions++;
            if (isCompleted(record.getStatus())) {
                completedSessions++;
            }
            
            if (record.getHours() != null) {
                totalHours += record.getHours();
            }
            
            if (record.getTotalAmount() != null) {
                long amount = record.getTotalAmount();
                totalAmount += amount;
                if (Boolean.TRUE.equals(record.getPaid())) {
                    totalPaid += amount;
                } else {
                    totalUnpaid += amount;
                }
            }
        }

        // 3. Construct response with gamification elements
        String quote = getMotivationalQuote(completedSessions, totalSessions);
        boolean shouldShowCelebration = totalSessions > 0 && completedSessions == totalSessions;

        return StudentDashboardStats.builder()
                .totalSessionsRaw(totalSessions)
                .completedSessionsRaw(completedSessions)
                .totalHoursRaw(totalHours)
                .totalPaidRaw(totalPaid)
                .totalUnpaidRaw(totalUnpaid)
                .totalAmountRaw(totalAmount)
                .totalDocumentsRaw(documentCount)
                .totalHoursFormatted(String.format("%.1f giờ", totalHours))
                .totalPaidFormatted(FormatterUtils.formatCurrency(totalPaid))
                .totalUnpaidFormatted(FormatterUtils.formatCurrency(totalUnpaid))
                .totalAmountFormatted(FormatterUtils.formatCurrency(totalAmount))
                .motivationalQuote(quote)
                .showConfetti(shouldShowCelebration)
                .build();
    }

    private boolean isCancelled(LessonStatus status) {
        return status == LessonStatus.CANCELLED_BY_STUDENT ||
                status == LessonStatus.CANCELLED_BY_TUTOR;
    }

    private boolean isCompleted(LessonStatus status) {
        return status == LessonStatus.COMPLETED || status == LessonStatus.PAID;
    }

    private String getMotivationalQuote(int completed, int total) {
        if (total == 0) {
            return "Hãy kiểm tra lịch học sắp tới nhé!";
        }
        
        double progressRatio = (double) completed / total;
        if (progressRatio >= 1.0) {
            return "Xuất sắc! Bạn đã hoàn thành tất cả buổi học.";
        }
        if (progressRatio >= 0.8) {
            return "Tuyệt vời! Sắp về đích rồi.";
        }
        if (progressRatio >= 0.5) {
            return "Cố lên! Bạn đã đi được một nửa chặng đường.";
        }
        return "Khởi đầu tốt! Hãy tiếp tục phát huy.";
    }

    /**
     * Retrieves aggregated monthly statistics for financial reporting.
     * Results are cached for 5 minutes to optimize repeated chart rendering.
     * 
     * @return List of MonthlyStats records
     */
    @Cacheable(value = "monthlyStats")
    public List<MonthlyStats> getMonthlyStats() {
        return sessionRecordRepository.findAllMonthlyStatsAggregated();
    }
}
