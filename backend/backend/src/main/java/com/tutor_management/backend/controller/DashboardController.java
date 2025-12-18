package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.response.DashboardStats;
import com.tutor_management.backend.dto.response.MonthlyStats;
import com.tutor_management.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============= Dashboard Controller =============
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
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