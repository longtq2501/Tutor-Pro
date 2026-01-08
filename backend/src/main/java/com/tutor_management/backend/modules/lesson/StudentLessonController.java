package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonStatsResponse;
import com.tutor_management.backend.modules.auth.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Student Lesson operations
 * Accessible by: STUDENT, ADMIN
 *
 * ✅ UPDATED: All methods now pass studentId to service layer
 */
@RestController
@RequestMapping("/api/student/lessons")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentLessonController {

    private final LessonService lessonService;

    /**
     * Get all lessons for current student
     *
     * ✅ UPDATED: Fetches via assignments
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getAllLessons(
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        List<LessonResponse> lessons = lessonService.getStudentLessons(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Get lesson by ID
     *
     * UPDATED: Passes studentId to verify access via assignment
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        try {
            // Pass studentId to verify assignment
            LessonResponse lesson = lessonService.getLessonById(id, user.getStudentId());

            // Increment view count
            lessonService.incrementViewCount(id, user.getStudentId());

            return ResponseEntity.ok(ApiResponse.success(lesson));
        } catch (Exception e) {
            log.error("Error getting lesson {}: {}", id, e.getMessage());
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("You don't have permission to access this lesson"));
        }
    }

    /**
     * Get lessons by month/year
     *
     * UPDATED: Filters assignments by lesson date
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getLessonsByMonthYear(
            @RequestParam int year,
            @RequestParam int month,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        List<LessonResponse> lessons = lessonService.getLessonsByMonthYear(user.getStudentId(), year, month);
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Mark lesson as completed
     *
     * UPDATED: Updates assignment record
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        LessonResponse lesson = lessonService.markAsCompleted(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked as completed", lesson));
    }

    /**
     * Mark lesson as incomplete
     *
     * UPDATED: Updates assignment record
     */
    @PostMapping("/{id}/incomplete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsIncomplete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        LessonResponse lesson = lessonService.markAsIncomplete(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked as incomplete", lesson));
    }

    /**
     * Get lesson statistics
     *
     * UPDATED: Calculates from assignments
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<LessonStatsResponse>> getStats(
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        LessonStatsResponse stats = lessonService.getStudentStats(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
