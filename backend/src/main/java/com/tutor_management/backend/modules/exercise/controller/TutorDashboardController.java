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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

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
    private final com.tutor_management.backend.modules.auth.UserRepository userRepository;
    private final com.tutor_management.backend.modules.tutor.repository.TutorRepository tutorRepository;

    /**
     * Retrieves a student-centric summary of exercise completion statuses with pagination.
     */
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<TutorStudentSummaryResponse>>> getStudentSummaries(
            @PageableDefault(size = 10) Pageable pageable,
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.tutor_management.backend.modules.auth.User user) {
        log.info("Fetching student exercise summaries for tutor dashboard (page: {})", pageable.getPageNumber());
        
        Long tutorId = getCurrentTutorId();
        return ResponseEntity.ok(ApiResponse.success(exerciseService.getStudentSummaries(tutorId, pageable)));
    }

    private Long getCurrentTutorId() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        
        String email = auth.getName();
        com.tutor_management.backend.modules.auth.User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null || user.getRole() == com.tutor_management.backend.modules.auth.Role.ADMIN) {
            return null;
        }
        
        return tutorRepository.findByUserId(user.getId())
                .map(com.tutor_management.backend.modules.tutor.entity.Tutor::getId)
                .orElse(null);
    }
}
