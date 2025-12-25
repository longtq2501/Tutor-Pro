package com.tutor_management.backend.modules.dashboard;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;

    public DashboardStats getDashboardStats(String currentMonth) {
        int totalStudents = (int) studentRepository.count();

        Long totalPaid = sessionRecordRepository.sumTotalPaid();
        Long totalUnpaid = sessionRecordRepository.sumTotalUnpaid();

        Long currentMonthTotal = sessionRecordRepository.sumTotalPaidByMonth(currentMonth);
        Long currentMonthUnpaid = sessionRecordRepository.sumTotalUnpaidByMonth(currentMonth);

        return DashboardStats.builder()
                .totalStudents(totalStudents)
                .totalPaidAllTime(totalPaid != null ? totalPaid : 0L)
                .totalUnpaidAllTime(totalUnpaid != null ? totalUnpaid : 0L)
                .currentMonthTotal(currentMonthTotal != null ? currentMonthTotal : 0L)
                .currentMonthUnpaid(currentMonthUnpaid != null ? currentMonthUnpaid : 0L)
                .build();
    }

    public List<MonthlyStats> getMonthlyStats() {
        List<String> months = sessionRecordRepository.findDistinctMonths();

        return months.stream()
                .map(month -> {
                    Long totalPaid = sessionRecordRepository.sumTotalPaidByMonth(month);
                    Long totalUnpaid = sessionRecordRepository.sumTotalUnpaidByMonth(month);
                    Integer totalSessions = sessionRecordRepository.sumSessionsByMonth(month);

                    return MonthlyStats.builder()
                            .month(month)
                            .totalPaid(totalPaid != null ? totalPaid : 0L)
                            .totalUnpaid(totalUnpaid != null ? totalUnpaid : 0L)
                            .totalSessions(totalSessions != null ? totalSessions : 0)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
