package com.tutor_management.backend.modules.exercise.controller;

import com.tutor_management.backend.modules.exercise.dto.response.TutorStudentSummaryResponse;
import com.tutor_management.backend.modules.exercise.service.ExerciseService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller providing specialized analytical views for tutors.
 * Focuses on student performance aggregation and tracking.
 */
@RestController
@RequestMapping("/api/tutor/dashboard")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class TutorDashboardController {

    private final ExerciseService exerciseService;

    /**
     * Retrieves a student-centric summary of exercise completion statuses.
     */
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<TutorStudentSummaryResponse>>> getStudentSummaries() {
        log.info("Fetching student exercise summaries for tutor dashboard");
        return ResponseEntity.ok(ApiResponse.success(exerciseService.getStudentSummaries()));
    }
}
