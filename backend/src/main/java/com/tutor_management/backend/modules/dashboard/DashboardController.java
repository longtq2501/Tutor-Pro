package com.tutor_management.backend.modules.dashboard;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(
            @RequestParam(required = false) String currentMonth) {
        // If currentMonth not provided, use current month
        if (currentMonth == null || currentMonth.isEmpty()) {
            currentMonth = java.time.YearMonth.now().toString();
        }
        return ResponseEntity.ok(dashboardService.getDashboardStats(currentMonth));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/monthly-stats")
    public ResponseEntity<List<MonthlyStats>> getMonthlyStats() {
        return ResponseEntity.ok(dashboardService.getMonthlyStats());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/student/stats")
    public ResponseEntity<com.tutor_management.backend.modules.dashboard.dto.response.StudentDashboardStats> getStudentStats(
            @RequestParam Long studentId,
            @RequestParam(required = false) String currentMonth) {

        if (currentMonth == null || currentMonth.isEmpty()) {
            currentMonth = java.time.YearMonth.now().toString();
        }

        // TODO: Security check - if role is STUDENT, ensure studentId matches logged in
        // user

        return ResponseEntity.ok(dashboardService.getStudentDashboardStats(studentId, currentMonth));
    }
}
