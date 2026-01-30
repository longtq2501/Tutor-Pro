package com.tutor_management.backend.modules.course.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.course.dto.request.UpdateVideoProgressRequest;
import com.tutor_management.backend.modules.course.dto.response.CourseNavigationResponse;
import com.tutor_management.backend.modules.course.dto.response.LessonProgressResponse;
import com.tutor_management.backend.modules.course.service.LessonProgressService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing student lesson progress and course-aware navigation.
 */
@RestController
@RequestMapping("/api/student/progress")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class LessonProgressController {

    private final LessonProgressService progressService;

    /**
     * Updates the video watch progress for a specific lesson.
     */
    @PostMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> updateProgress(
            @PathVariable Long lessonId,
            @Valid @RequestBody UpdateVideoProgressRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student profile not found"));
        }

        LessonProgressResponse response = progressService.updateVideoProgress(lessonId, user.getStudentId(), request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Fetches current progress status for a lesson.
     */
    @GetMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<LessonProgressResponse>> getLessonProgress(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student profile not found"));
        }

        // Also record a view when progress is first requested for a session
        progressService.recordLessonView(lessonId, user.getStudentId());
        
        LessonProgressResponse response = progressService.getLessonProgress(lessonId, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Retrieves navigation meta for a lesson within the context of a specific course.
     */
    @GetMapping("/navigation/{courseId}/{lessonId}")
    public ResponseEntity<ApiResponse<CourseNavigationResponse>> getNavigation(
            @PathVariable Long courseId,
            @PathVariable Long lessonId,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student profile not found"));
        }

        CourseNavigationResponse response = progressService.getCourseNavigation(courseId, lessonId, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
