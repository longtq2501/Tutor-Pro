package com.tutor_management.backend.modules.dashboard;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.shared.PDFGeneratorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final PDFGeneratorService pdfGeneratorService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(
            @RequestParam(required = false) String currentMonth) {
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
        return ResponseEntity.ok(dashboardService.getStudentDashboardStats(studentId, currentMonth));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportDashboardPDF(
            @RequestParam(required = false) String currentMonth) {
        try {
            if (currentMonth == null || currentMonth.isEmpty()) {
                currentMonth = java.time.YearMonth.now().toString();
            }

            DashboardStats stats = dashboardService.getDashboardStats(currentMonth);
            List<MonthlyStats> monthlyStats = dashboardService.getMonthlyStats();

            byte[] pdfBytes = pdfGeneratorService.generateDashboardReportPDF(stats, monthlyStats);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("Bao-Cao-He-Thong-" + currentMonth + ".pdf")
                            .build());

            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            log.error("CRITICAL ERROR in exportDashboardPDF: ", e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Lỗi xuất PDF: " + e.getMessage()).getBytes());
        }
    }
}
