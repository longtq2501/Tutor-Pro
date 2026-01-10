package com.tutor_management.backend.modules.submission.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.submission.dto.request.CreateSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.request.GradeSubmissionRequest;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionListItemResponse;
import com.tutor_management.backend.modules.submission.dto.response.SubmissionResponse;
import com.tutor_management.backend.modules.submission.service.SubmissionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing student work submissions and evaluation cycles.
 * Provides endpoints for drafting, final submission, and tutor-led grading.
 */
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Slf4j
public class SubmissionController {
    
    private final SubmissionService submissionService;
    
    /**
     * Persists a submission in DRAFT state. 
     * Authorized for: STUDENT.
     */
    @PostMapping("/draft")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> saveDraft(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Student {} saving draft for exercise {}", user.getEmail(), request.getExerciseId());
        SubmissionResponse submission = submissionService.saveDraft(request, user.getId().toString());
        return ResponseEntity.ok(ApiResponse.success("Đã lưu bản nháp thành công", submission));
    }
    
    /**
     * Executes final submission of an exercise attempt.
     * Authorized for: STUDENT.
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submit(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Student {} submitting exercise {}", user.getEmail(), request.getExerciseId());
        SubmissionResponse submission = submissionService.submit(request, user.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Nộp bài thành công", submission));
    }
    
    /**
     * Retrieves specific submission details.
     * Authorized for: ADMIN, TUTOR, STUDENT (Owner only logic in service).
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.getSubmission(id)));
    }
    
    /**
     * Retrieves a specific attempt by student-exercise pair.
     */
    @GetMapping("/exercise/{exerciseId}/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmissionByExerciseAndStudent(
            @PathVariable String exerciseId,
            @PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.getSubmissionByExerciseAndStudent(exerciseId, studentId)));
    }
    
    /**
     * Lists all submissions filtered by exercise.
     * Authorized for: ADMIN, TUTOR.
     */
    @GetMapping("/exercise/{exerciseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    public ResponseEntity<ApiResponse<List<SubmissionListItemResponse>>> listSubmissionsByExercise(
            @PathVariable String exerciseId) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.listSubmissionsByExercise(exerciseId)));
    }
    
    /**
     * Lists all submission attempts for a specific student.
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> listSubmissionsByStudent(
            @PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(submissionService.listSubmissionsByStudent(studentId)));
    }
    
    /**
     * Finalizes grading and feedback for a student submission.
     * Authorized for: ADMIN, TUTOR.
     */
    @PutMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> gradeSubmission(
            @PathVariable String id,
            @Valid @RequestBody GradeSubmissionRequest request) {
        log.info("Tutor providing feedback for submission {}", id);
        SubmissionResponse submission = submissionService.gradeSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Đã chấm điểm bài nộp thành công", submission));
    }
}
