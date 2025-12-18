package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.SessionRecordRequest;
import com.tutor_management.backend.dto.request.SessionRecordUpdateRequest;
import com.tutor_management.backend.dto.response.SessionRecordResponse;
import com.tutor_management.backend.service.SessionRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============= Session Record Controller =============
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class SessionRecordController {

    private final SessionRecordService sessionRecordService;

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
    public ResponseEntity<SessionRecordResponse> togglePayment(@PathVariable Long id) {
        return ResponseEntity.ok(sessionRecordService.togglePayment(id));
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
            @RequestBody SessionRecordUpdateRequest request
    ) {
        return ResponseEntity.ok(sessionRecordService.updateRecord(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-completed")
    public ResponseEntity<SessionRecordResponse> toggleCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(sessionRecordService.toggleCompleted(id));
    }
}
