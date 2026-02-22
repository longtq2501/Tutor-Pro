package com.tutor_management.backend.modules.tutor.controller;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.tutor.dto.TutorStatsDTO;
import com.tutor_management.backend.modules.tutor.dto.request.TutorRequest;
import com.tutor_management.backend.modules.tutor.dto.response.TutorResponse;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.document.dto.response.DocumentResponse;
import com.tutor_management.backend.modules.tutor.service.TutorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tutors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Enforce Admin access for all endpoints
public class TutorController {

    private final TutorService tutorService;

    @GetMapping
    public ApiResponse<Page<TutorResponse>> getAllTutors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(tutorService.getAllTutors(search, status, pageable));
    }

    @GetMapping("/{id}")
    public ApiResponse<TutorResponse> getTutorById(@PathVariable Long id) {
        return ApiResponse.success(tutorService.getTutorById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<TutorResponse> createTutor(@Valid @RequestBody TutorRequest request) {
        return ApiResponse.success(tutorService.createTutor(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TutorResponse> updateTutor(@PathVariable Long id, @Valid @RequestBody TutorRequest request) {
        return ApiResponse.success(tutorService.updateTutor(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTutor(@PathVariable Long id) {
        tutorService.deleteTutor(id);
        return ApiResponse.success(null);
    }

    @GetMapping("/{id}/stats")
    public ApiResponse<TutorStatsDTO> getTutorStats(@PathVariable Long id) {
        return ApiResponse.success(tutorService.getTutorStats(id));
    }

    @PutMapping("/{id}/toggle-status")
    public ApiResponse<TutorResponse> toggleTutorStatus(@PathVariable Long id) {
        return ApiResponse.success(tutorService.toggleTutorStatus(id));
    }

    @GetMapping("/{id}/students")
    public ApiResponse<Page<StudentResponse>> getTutorStudents(
            @PathVariable Long id,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(tutorService.getTutorStudents(id, pageable));
    }

    @GetMapping("/{id}/sessions")
    public ApiResponse<Page<SessionRecordResponse>> getTutorSessions(
            @PathVariable Long id,
            @RequestParam(required = false) String month,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(tutorService.getTutorSessions(id, month, pageable));
    }

    @GetMapping("/{id}/documents")
    public ApiResponse<Page<DocumentResponse>> getTutorDocuments(
            @PathVariable Long id,
            @PageableDefault(size = 10) Pageable pageable) {
        return ApiResponse.success(tutorService.getTutorDocuments(id, pageable));
    }
}
