package com.tutor_management.backend.modules.dashboard;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.LessonStatus;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.student.StudentRepository;
import com.tutor_management.backend.util.FormatterUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final com.tutor_management.backend.modules.document.DocumentRepository documentRepository; // Inject
                                                                                                        // DocumentRepository

    // ✅ PERFORMANCE: Cache dashboard stats for 2 minutes
    @org.springframework.cache.annotation.Cacheable(value = "dashboardStats", key = "#currentMonth")
    public DashboardStats getDashboardStats(String currentMonth) {
        // 1. Lấy dữ liệu thô từ Repository (Hàm này bạn đã tối ưu SQL)
        DashboardStats stats = sessionRecordRepository.getFinanceSummary(currentMonth);

        // 2. Format tiền tệ bằng Utility class vừa tạo
        stats.setTotalPaidAllTime(FormatterUtils.formatCurrency(stats.getTotalPaidRaw()));
        stats.setTotalUnpaidAllTime(FormatterUtils.formatCurrency(stats.getTotalUnpaidRaw()));
        stats.setCurrentMonthTotal(FormatterUtils.formatCurrency(stats.getCurrentMonthTotalRaw()));

        // 3. Tính toán Trend (Giữ nguyên logic cũ đã tối ưu)
        List<MonthlyStats> monthlyList = sessionRecordRepository.findAllMonthlyStatsAggregated();
        if (monthlyList.size() >= 2) {
            long currentRev = monthlyList.get(0).getTotalPaid() + monthlyList.get(0).getTotalUnpaid();
            long prevRev = monthlyList.get(1).getTotalPaid() + monthlyList.get(1).getTotalUnpaid();
            if (prevRev > 0) {
                double change = ((double) (currentRev - prevRev) / prevRev) * 100;
                stats.setRevenueTrendValue(Math.abs(Math.round(change * 10.0) / 10.0));
                stats.setRevenueTrendDirection(change >= 0 ? "up" : "down");
            }
        }
        return stats;
    }

    // ✅ STUDENT DASHBOARD LOGIC (Mem-cache style)
    public com.tutor_management.backend.modules.dashboard.dto.response.StudentDashboardStats getStudentDashboardStats(
            Long studentId, String month) {
        // 1. Fetch data in parallel (Optimized queries)
        var records = sessionRecordRepository.findByStudentIdAndMonth(studentId, month);
        int documentCount = documentRepository.countByStudentIdOrStudentIsNull(studentId).intValue();

        // 2. Aggregate in memory (Dataset is small per student/month)
        int totalSessions = 0;
        int completedSessions = 0;
        double totalHours = 0.0;
        long totalPaid = 0;
        long totalUnpaid = 0;
        long totalAmount = 0;

        for (var r : records) {
            // Filter cancelled sessions
            if (isCancelled(r.getStatus()))
                continue;

            totalSessions++;
            if (isCompleted(r.getStatus())) {
                completedSessions++;
            }
            if (r.getHours() != null) {
                totalHours += r.getHours();
            }
            if (r.getTotalAmount() != null) {
                long amount = r.getTotalAmount();
                totalAmount += amount;
                if (Boolean.TRUE.equals(r.getPaid())) {
                    totalPaid += amount;
                } else {
                    totalUnpaid += amount;
                }
            }
        }

        // 3. Build DTO with Motivational Quote
        String quote = getMotivationalQuote(completedSessions, totalSessions);
        boolean showConfetti = totalSessions > 0 && completedSessions == totalSessions;

        return com.tutor_management.backend.modules.dashboard.dto.response.StudentDashboardStats.builder()
                .totalSessionsRaw(totalSessions)
                .completedSessionsRaw(completedSessions)
                .totalHoursRaw(totalHours)
                .totalPaidRaw(totalPaid)
                .totalUnpaidRaw(totalUnpaid)
                .totalAmountRaw(totalAmount)
                .totalDocumentsRaw(documentCount)
                // Formatted
                .totalHoursFormatted(String.format("%.1fh", totalHours))
                .totalPaidFormatted(FormatterUtils.formatCurrency(totalPaid))
                .totalUnpaidFormatted(FormatterUtils.formatCurrency(totalUnpaid))
                .totalAmountFormatted(FormatterUtils.formatCurrency(totalAmount))
                // Gamification
                .motivationalQuote(quote)
                .showConfetti(showConfetti)
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
        if (total == 0)
            return "Hãy kiểm tra lịch học sắp tới nhé!";
        double percent = (double) completed / total;
        if (percent >= 1.0)
            return "Xuất sắc! Bạn đã hoàn thành tất cả buổi học.";
        if (percent >= 0.8)
            return "Tuyệt vời! Sắp về đích rồi.";
        if (percent >= 0.5)
            return "Cố lên! Bạn đã đi được một nửa chặng đường.";
        return "Khởi đầu tốt! Hãy tiếp tục phát huy.";
    }

    // ✅ PERFORMANCE: Cache monthly stats for 5 minutes
    @org.springframework.cache.annotation.Cacheable(value = "monthlyStats")
    public List<MonthlyStats> getMonthlyStats() {
        return sessionRecordRepository.findAllMonthlyStatsAggregated();
    }

    // public List<MonthlyStats> getMonthlyStats() {
    // List<String> months = sessionRecordRepository.findDistinctMonths();

    // return months.stream()
    // .map(month -> {
    // Long totalPaid = sessionRecordRepository.sumTotalPaidByMonth(month);
    // Long totalUnpaid = sessionRecordRepository.sumTotalUnpaidByMonth(month);
    // Integer totalSessions = sessionRecordRepository.sumSessionsByMonth(month);

    // return MonthlyStats.builder()
    // .month(month)
    // .totalPaid(totalPaid != null ? totalPaid : 0L)
    // .totalUnpaid(totalUnpaid != null ? totalUnpaid : 0L)
    // .totalSessions(totalSessions != null ? totalSessions : 0)
    // .build();
    // })
    // .collect(Collectors.toList());
    // }
}
