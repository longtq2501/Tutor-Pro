package com.tutor_management.backend.modules.dashboard;

import java.util.List;

import com.tutor_management.backend.util.FormatterUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.student.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;

//    public DashboardStats getDashboardStats(String currentMonth) {
//        int totalStudents = (int) studentRepository.count();
//
//        Long totalPaid = sessionRecordRepository.sumTotalPaid();
//        Long totalUnpaid = sessionRecordRepository.sumTotalUnpaid();
//
//        Long currentMonthPaid = sessionRecordRepository.sumTotalPaidByMonth(currentMonth);
//        Long currentMonthUnpaid = sessionRecordRepository.sumTotalUnpaidByMonth(currentMonth);
//
//        return DashboardStats.builder()
//                .totalStudents(totalStudents)
//                .totalPaidAllTime(totalPaid != null ? totalPaid : 0L)
//                .totalUnpaidAllTime(totalUnpaid != null ? totalUnpaid : 0L)
//                .currentMonthTotal((currentMonthPaid != null ? currentMonthPaid : 0L)
//                        + (currentMonthUnpaid != null ? currentMonthUnpaid : 0L))
//                .currentMonthUnpaid(currentMonthUnpaid != null ? currentMonthUnpaid : 0L)
//                .build();
//    }

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
