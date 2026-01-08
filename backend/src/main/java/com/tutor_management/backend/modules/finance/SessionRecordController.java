package com.tutor_management.backend.modules.finance;

import com.tutor_management.backend.modules.finance.dto.request.SessionRecordRequest;
import com.tutor_management.backend.modules.finance.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.shared.ExportService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionRecordController {

    private final SessionRecordService sessionRecordService;
    private final ExportService exportService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping
    public ResponseEntity<List<SessionRecordResponse>> getAllRecords() {
        return ResponseEntity.ok(sessionRecordService.getAllRecords());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/month/{month}")
    public ResponseEntity<List<SessionRecordResponse>> getRecordsByMonth(@PathVariable String month) {
        return ResponseEntity.ok(sessionRecordService.getRecordsByMonth(month));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/months")
    public ResponseEntity<List<String>> getDistinctMonths() {
        return ResponseEntity.ok(sessionRecordService.getDistinctMonths());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<SessionRecordResponse> createRecord(@Valid @RequestBody SessionRecordRequest request) {
        return ResponseEntity.ok(sessionRecordService.createRecord(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-payment")
    public ResponseEntity<SessionRecordResponse> togglePayment(
            @PathVariable Long id,
            @RequestParam(required = false) Integer version) {
        return ResponseEntity.ok(sessionRecordService.togglePayment(id, version));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        sessionRecordService.deleteRecord(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/unpaid")
    public ResponseEntity<List<SessionRecordResponse>> getAllUnpaidSessions() {
        List<SessionRecordResponse> unpaidSessions = sessionRecordService.getAllUnpaidSessions();
        return ResponseEntity.ok(unpaidSessions);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<SessionRecordResponse> updateRecord(
            @PathVariable Long id,
            @RequestBody SessionRecordUpdateRequest request) {
        return ResponseEntity.ok(sessionRecordService.updateRecord(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-completed")
    public ResponseEntity<SessionRecordResponse> toggleCompleted(
            @PathVariable Long id,
            @RequestParam(required = false) Integer version) {
        return ResponseEntity.ok(sessionRecordService.toggleCompleted(id, version));
    }

    // ========== NEW ENDPOINTS FOR PHASE 2 ==========

    /**
     * Get a single session by ID
     * Used for detail modal
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<SessionRecordResponse> getSessionById(@PathVariable Long id) {
        return ResponseEntity.ok(sessionRecordService.getSessionById(id));
    }

    /**
     * Update session status with optimistic locking
     * Validates status transitions using StatusTransitionValidator
     * 
     * @param id        Session ID
     * @param newStatus Target status
     * @param version   Current version for optimistic locking
     * @return Updated session
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<SessionRecordResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String newStatus,
            @RequestParam Integer version) {
        LessonStatus targetStatus = LessonStatus.valueOf(newStatus);
        return ResponseEntity.ok(sessionRecordService.updateStatus(id, targetStatus, version));
    }

    /**
     * Duplicate a session
     * Creates a copy with SCHEDULED status
     * 
     * @param id Session ID to duplicate
     * @return New session
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<SessionRecordResponse> duplicateSession(@PathVariable Long id) {
        return ResponseEntity.ok(sessionRecordService.duplicateSession(id));
    }

    /**
     * Export sessions to Excel
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Long studentId) {

        List<SessionRecordResponse> sessions;
        if (studentId != null && month != null) {
            sessions = sessionRecordService.getRecordsByStudentIdAndMonth(studentId, month);
        } else if (month != null) {
            sessions = sessionRecordService.getRecordsByMonth(month);
        } else if (studentId != null) {
            sessions = sessionRecordService.getRecordsByStudentId(studentId);
        } else {
            sessions = sessionRecordService.getAllRecords();
        }

        try {
            byte[] bytes = exportService.exportSessionsToExcel(sessions);
            String fileName = "Sessions_Export_" + (month != null ? month : "All") + ".xlsx";

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=" + fileName)
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(bytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @DeleteMapping("/month/{month}")
    public ResponseEntity<Void> deleteSessionsByMonth(@PathVariable String month) {
        sessionRecordService.deleteSessionsByMonth(month);
        return ResponseEntity.ok().build();
    }
}
