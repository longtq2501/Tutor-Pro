package com.tutor_management.backend.modules.dashboard;

import java.util.List;
import java.time.YearMonth;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.dashboard.dto.response.StudentDashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.shared.PDFGeneratorService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for providing dashboard-related data and report exports.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;
    private final PDFGeneratorService pdfGeneratorService;

    /**
     * Retrieves overall system statistics for administrators and tutors.
     * 
     * @param currentMonth The target month (YYYY-MM format). Defaults to current month.
     * @return DashboardStats containing aggregated financial and growth metrics.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats(
            @RequestParam(required = false) String currentMonth) {
        
        String targetMonth = (currentMonth == null || currentMonth.isEmpty()) 
                ? YearMonth.now().toString() 
                : currentMonth;
                
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats(targetMonth)));
    }

    /**
     * Retrieves a list of monthly financial statistics for trend analysis.
     * 
     * @return List of MonthlyStats records.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/monthly-stats")
    public ResponseEntity<ApiResponse<List<MonthlyStats>>> getMonthlyStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getMonthlyStats()));
    }

    /**
     * Retrieves personalized dashboard statistics for a specific student.
     * 
     * @param studentId Primary ID of the student.
     * @param currentMonth The target month (YYYY-MM format). Defaults to current month.
     * @return StudentDashboardStats containing attendance and financial data.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/student/stats")
    public ResponseEntity<ApiResponse<StudentDashboardStats>> getStudentStats(
            @RequestParam Long studentId,
            @RequestParam(required = false) String currentMonth) {

        String targetMonth = (currentMonth == null || currentMonth.isEmpty()) 
                ? YearMonth.now().toString() 
                : currentMonth;
                
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStudentDashboardStats(studentId, targetMonth)));
    }

    /**
     * Generates and exports a comprehensive PDF report of the dashboard metrics.
     * 
     * @param currentMonth The month to include in the report (YYYY-MM format).
     * @return ResponseEntity containing the PDF byte array as an attachment.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/export-pdf")
    public ResponseEntity<?> exportDashboardPDF(
            @RequestParam(required = false) String currentMonth) {
        try {
            String targetMonth = (currentMonth == null || currentMonth.isEmpty()) 
                    ? YearMonth.now().toString() 
                    : currentMonth;

            DashboardStats summaryStats = dashboardService.getDashboardStats(targetMonth);
            List<MonthlyStats> monthlyTrend = dashboardService.getMonthlyStats();

            byte[] pdfContent = pdfGeneratorService.generateDashboardReportPDF(summaryStats, monthlyTrend);

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_PDF);
            responseHeaders.setContentDisposition(
                    ContentDisposition.builder("attachment")
                            .filename("Bao-Cao-He-Thong-" + targetMonth + ".pdf")
                            .build());

            return new ResponseEntity<>(pdfContent, responseHeaders, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Failed to generate/export dashboard report for month {}: ", currentMonth, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi trong quá trình xuất báo cáo PDF: " + e.getMessage());
        }
    }
}
