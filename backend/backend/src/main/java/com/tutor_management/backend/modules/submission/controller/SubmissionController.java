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
 * REST Controller for Submission management
 */
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Slf4j
public class SubmissionController {
    
    private final SubmissionService submissionService;
    
    /**
     * Save draft submission
     * POST /api/submissions/draft
     */
    @PostMapping("/draft")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> saveDraft(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Saving draft for exercise: {} by student: {}", request.getExerciseId(), user.getEmail());
        SubmissionResponse submission = submissionService.saveDraft(request, user.getId().toString());
        return ResponseEntity.ok(ApiResponse.success("Draft saved successfully", submission));
    }
    
    /**
     * Submit exercise
     * POST /api/submissions
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submit(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Submitting exercise: {} by student: {}", request.getExerciseId(), user.getEmail());
        SubmissionResponse submission = submissionService.submit(request, user.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Submission completed successfully", submission));
    }
    
    /**
     * Get submission by ID
     * GET /api/submissions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable String id) {
        log.info("Fetching submission: {}", id);
        SubmissionResponse submission = submissionService.getSubmission(id);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }
    
    /**
     * Get submission by exercise and student
     * GET /api/submissions/exercise/{exerciseId}/student/{studentId}
     */
    @GetMapping("/exercise/{exerciseId}/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmissionByExerciseAndStudent(
            @PathVariable String exerciseId,
            @PathVariable String studentId) {
        log.info("Fetching submission for exercise: {} and student: {}", exerciseId, studentId);
        SubmissionResponse submission = submissionService.getSubmissionByExerciseAndStudent(exerciseId, studentId);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }
    
    /**
     * List submissions for an exercise
     * GET /api/submissions/exercise/{exerciseId}
     */
    @GetMapping("/exercise/{exerciseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    public ResponseEntity<ApiResponse<List<SubmissionListItemResponse>>> listSubmissionsByExercise(
            @PathVariable String exerciseId) {
        log.info("Listing submissions for exercise: {}", exerciseId);
        List<SubmissionListItemResponse> submissions = submissionService.listSubmissionsByExercise(exerciseId);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }
    
    /**
     * List submissions by student
     * GET /api/submissions/student/{studentId}
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> listSubmissionsByStudent(
            @PathVariable String studentId) {
        log.info("Listing submissions for student: {}", studentId);
        List<SubmissionResponse> submissions = submissionService.listSubmissionsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success(submissions));
    }
    
    /**
     * Grade essay questions in a submission
     * PUT /api/submissions/{id}/grade
     */
    @PutMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    public ResponseEntity<ApiResponse<SubmissionResponse>> gradeSubmission(
            @PathVariable String id,
            @Valid @RequestBody GradeSubmissionRequest request) {
        log.info("Grading submission: {}", id);
        SubmissionResponse submission = submissionService.gradeSubmission(id, request);
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", submission));
    }
}
