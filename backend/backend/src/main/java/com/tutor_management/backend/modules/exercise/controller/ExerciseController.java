package com.tutor_management.backend.modules.exercise.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import com.tutor_management.backend.modules.exercise.dto.request.AssignExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.CreateExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.request.ImportExerciseRequest;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseResponse;
import com.tutor_management.backend.modules.exercise.dto.response.ImportPreviewResponse;
import com.tutor_management.backend.modules.exercise.service.ExerciseService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
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
 * REST Controller for Exercise management
 */
@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class ExerciseController {
    
    private final ExerciseService exerciseService;
    
    /**
     * Parse text and return preview without saving
     * POST /api/exercises/import/text
     */
    @PostMapping("/import/text")
    public ResponseEntity<ApiResponse<ImportPreviewResponse>> importPreview(
            @Valid @RequestBody ImportExerciseRequest request) {
        log.info("Received import preview request");
        ImportPreviewResponse preview = exerciseService.previewImport(request);
        return ResponseEntity.ok(ApiResponse.success("Parsed successfully", preview));
    }
    
    /**
     * Create new exercise
     * POST /api/exercises
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ExerciseResponse>> createExercise(
            @Valid @RequestBody CreateExerciseRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Creating exercise: {} by user: {}", request.getTitle(), user.getEmail());
        ExerciseResponse exercise = exerciseService.createExercise(request, user.getId().toString());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Exercise created successfully", exercise));
    }
    
    /**
     * Update existing exercise
     * PUT /api/exercises/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseResponse>> updateExercise(
            @PathVariable String id,
            @Valid @RequestBody CreateExerciseRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Updating exercise: {} by user: {}", id, user.getEmail());
        ExerciseResponse exercise = exerciseService.updateExercise(id, request, user.getId().toString());
        return ResponseEntity.ok(ApiResponse.success("Exercise updated successfully", exercise));
    }
    
    /**
     * Get exercise by ID
     * GET /api/exercises/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<ExerciseResponse>> getExercise(@PathVariable String id) {
        log.info("Fetching exercise: {}", id);
        ExerciseResponse exercise = exerciseService.getExercise(id);
        return ResponseEntity.ok(ApiResponse.success(exercise));
    }
    
    /**
     * List exercises with optional filters
     * GET /api/exercises?classId={classId}&status={status}
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<ExerciseListItemResponse>>> listExercises(
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) ExerciseStatus status) {
        log.info("Listing exercises - classId: {}, status: {}", classId, status);
        List<ExerciseListItemResponse> exercises = exerciseService.listExercises(classId, status);
        return ResponseEntity.ok(ApiResponse.success(exercises));
    }
    
    /**
     * Delete exercise
     * DELETE /api/exercises/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExercise(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        log.info("Deleting exercise: {} by user: {}", id, user.getEmail());
        exerciseService.deleteExercise(id, user.getId().toString());
        return ResponseEntity.ok(ApiResponse.success("Exercise deleted successfully", null));
    }

    /**
     * Assign exercise to a specific student
     * POST /api/exercises/{id}/assign
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<Void>> assignToStudent(
            @PathVariable String id,
            @Valid @RequestBody AssignExerciseRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Assigning exercise: {} to student: {} by user: {}", id, request.getStudentId(), user.getEmail());
        exerciseService.assignToStudent(id, request.getStudentId(), user.getId().toString(), request.getDeadline());
        return ResponseEntity.ok(ApiResponse.success("Exercise assigned successfully", null));
    }

    /**
     * List exercises assigned to the current student
     * GET /api/exercises/assigned
     */
    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN', 'TUTOR')")
    public ResponseEntity<ApiResponse<List<ExerciseListItemResponse>>> listAssignedExercises(
            @AuthenticationPrincipal User user) {
        log.info("Listing assigned exercises for student: {}", user.getEmail());
        List<ExerciseListItemResponse> exercises = exerciseService.listAssignedExercises(user.getId().toString());
        return ResponseEntity.ok(ApiResponse.success(exercises));
    }
}
