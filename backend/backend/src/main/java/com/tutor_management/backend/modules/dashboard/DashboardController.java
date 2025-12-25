package com.tutor_management.backend.modules.dashboard;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestParam String currentMonth) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(currentMonth));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/monthly-stats")
    public ResponseEntity<List<MonthlyStats>> getMonthlyStats() {
        return ResponseEntity.ok(dashboardService.getMonthlyStats());
    }
}
