package com.tutor_management.backend.modules.schedule.controller;

import com.tutor_management.backend.modules.schedule.service.RecurringScheduleService;
import com.tutor_management.backend.modules.schedule.dto.request.RecurringScheduleRequest;
import com.tutor_management.backend.modules.schedule.dto.response.RecurringScheduleResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.auth.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing recurring học tập schedules.
 * Provides endpoints for administrative schedule management and automated session generation.
 */
@RestController
@RequestMapping("/api/recurring-schedules")
@RequiredArgsConstructor
@Slf4j
public class RecurringScheduleController {

    private final RecurringScheduleService recurringScheduleService;

    /**
     * Retrieves all recurring schedules in the system.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RecurringScheduleResponse>>> getAllSchedules() {
        return ResponseEntity.ok(ApiResponse.success(recurringScheduleService.getAllSchedules()));
    }

    /**
     * Retrieves only currently active recurring schedules.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<RecurringScheduleResponse>>> getActiveSchedules() {
        return ResponseEntity.ok(ApiResponse.success(recurringScheduleService.getActiveSchedules()));
    }

    /**
     * Retrieves specific schedule details by ID.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecurringScheduleResponse>> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(recurringScheduleService.getScheduleById(id)));
    }

    /**
     * Retrieves the primary active schedule for a specific student.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<RecurringScheduleResponse>> getScheduleByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(recurringScheduleService.getScheduleByStudentId(studentId)));
    }

    /**
     * Registers a new recurring schedule.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<RecurringScheduleResponse>> createSchedule(
            @Valid @RequestBody RecurringScheduleRequest request,
            @AuthenticationPrincipal User user
    ) {
        log.info("Schedule creation initiated by: {}", user.getFullName());
        RecurringScheduleResponse response = recurringScheduleService.createSchedule(request, user.getFullName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới lịch học thành công", response));
    }

    /**
     * Updates an existing recurring schedule configuration.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecurringScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody RecurringScheduleRequest request
    ) {
        RecurringScheduleResponse response = recurringScheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch học thành công", response));
    }

    /**
     * Destructive removal of a schedule record.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        recurringScheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lịch học thành công", null));
    }

    /**
     * Toggles activation status for a specific schedule.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<RecurringScheduleResponse>> toggleActive(@PathVariable Long id) {
        RecurringScheduleResponse response = recurringScheduleService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Đã chuyển đổi trạng thái lịch học", response));
    }

    // --- Automated Session Generation ---

    /**
     * Triggers the generation of individual session records based on active schedules for a month.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/generate-sessions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateSessions(
            @RequestBody Map<String, Object> request
    ) {
        String month = (String) request.get("month");
        @SuppressWarnings("unchecked")
        List<Long> studentIds = (List<Long>) request.get("studentIds");

        if (month == null || month.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng cung cấp thông tin tháng (YYYY-MM)"));
        }

        int created = recurringScheduleService.generateSessionsForMonth(month, studentIds);

        Map<String, Object> data = new HashMap<>();
        data.put("month", month);
        data.put("sessionsCreated", created);

        return ResponseEntity.ok(ApiResponse.success("Đã tạo " + created + " buổi học thành công cho tháng " + month, data));
    }

    /**
     * Verifies if sessions have already been initialized for a specific month and student.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/check-month")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkMonth(
            @RequestParam String month,
            @RequestParam(required = false) Long studentId
    ) {
        boolean hasSessions = recurringScheduleService.hasSessionsForMonth(month, studentId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("month", month, "hasSessions", hasSessions)));
    }

    /**
     * Forecasts the number of sessions that will be generated for a specific month.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/count-sessions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> countSessions(
            @RequestBody Map<String, Object> request
    ) {
        String month = (String) request.get("month");
        @SuppressWarnings("unchecked")
        List<Long> studentIds = (List<Long>) request.get("studentIds");

        if (month == null || month.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng cung cấp thông tin tháng (YYYY-MM)"));
        }

        int count = recurringScheduleService.countSessionsToGenerate(month, studentIds);
        return ResponseEntity.ok(ApiResponse.success("Sẽ có " + count + " buổi học được tạo", Map.of("month", month, "count", count)));
    }
}
