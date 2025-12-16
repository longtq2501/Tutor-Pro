package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.RecurringScheduleRequest;
import com.tutor_management.backend.dto.response.RecurringScheduleResponse;
import com.tutor_management.backend.service.RecurringScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recurring-schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecurringScheduleController {

    private final RecurringScheduleService recurringScheduleService;

    @GetMapping
    public ResponseEntity<List<RecurringScheduleResponse>> getAllSchedules() {
        return ResponseEntity.ok(recurringScheduleService.getAllSchedules());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RecurringScheduleResponse>> getActiveSchedules() {
        return ResponseEntity.ok(recurringScheduleService.getActiveSchedules());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecurringScheduleResponse> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(recurringScheduleService.getScheduleById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<RecurringScheduleResponse> getScheduleByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(recurringScheduleService.getScheduleByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<RecurringScheduleResponse> createSchedule(@Valid @RequestBody RecurringScheduleRequest request) {
        return ResponseEntity.ok(recurringScheduleService.createSchedule(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurringScheduleResponse> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody RecurringScheduleRequest request
    ) {
        return ResponseEntity.ok(recurringScheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        recurringScheduleService.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<RecurringScheduleResponse> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(recurringScheduleService.toggleActive(id));
    }

    // ==================== Auto-Generate Sessions ====================

    /**
     * Tạo tự động các buổi học cho tháng
     * POST /api/recurring-schedules/generate-sessions
     * Body: { "month": "2025-01", "studentIds": [1,2,3] }
     */
    @PostMapping("/generate-sessions")
    public ResponseEntity<Map<String, Object>> generateSessions(
            @RequestBody Map<String, Object> request
    ) {
        String month = (String) request.get("month");
        @SuppressWarnings("unchecked")
        List<Long> studentIds = (List<Long>) request.get("studentIds");

        if (month == null || month.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Month is required"));
        }

        int created = recurringScheduleService.generateSessionsForMonth(month, studentIds);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("month", month);
        response.put("sessionsCreated", created);
        response.put("message", "Đã tạo " + created + " buổi học thành công!");

        return ResponseEntity.ok(response);
    }

    /**
     * Kiểm tra xem tháng này đã có sessions chưa
     * GET /api/recurring-schedules/check-month?month=2025-01&studentId=1
     */
    @GetMapping("/check-month")
    public ResponseEntity<Map<String, Object>> checkMonth(
            @RequestParam String month,
            @RequestParam(required = false) Long studentId
    ) {
        boolean hasSessions = recurringScheduleService.hasSessionsForMonth(month, studentId);

        Map<String, Object> response = new HashMap<>();
        response.put("month", month);
        response.put("hasSessions", hasSessions);

        return ResponseEntity.ok(response);
    }

    /**
     * Đếm số buổi học sẽ tạo
     * POST /api/recurring-schedules/count-sessions
     * Body: { "month": "2025-01", "studentIds": [1,2,3] }
     */
    @PostMapping("/count-sessions")
    public ResponseEntity<Map<String, Object>> countSessions(
            @RequestBody Map<String, Object> request
    ) {
        String month = (String) request.get("month");
        @SuppressWarnings("unchecked")
        List<Long> studentIds = (List<Long>) request.get("studentIds");

        if (month == null || month.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Month is required"));
        }

        int count = recurringScheduleService.countSessionsToGenerate(month, studentIds);

        Map<String, Object> response = new HashMap<>();
        response.put("month", month);
        response.put("count", count);
        response.put("message", "Sẽ tạo " + count + " buổi học");

        return ResponseEntity.ok(response);
    }
}