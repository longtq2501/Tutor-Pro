package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.response.ApiResponse;
import com.tutor_management.backend.dto.response.LessonResponse;
import com.tutor_management.backend.dto.response.LessonStatsResponse;
import com.tutor_management.backend.entity.User;
import com.tutor_management.backend.service.LessonService;
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
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonResponse>>> getAllLessons(
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Student {} getting all lessons", user.getStudentId());
        List<LessonResponse> lessons = lessonService.getStudentLessons(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Get lesson by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        log.info("Student getting lesson: {}", id);
        LessonResponse lesson = lessonService.getLessonById(id);

        // Verify ownership (if STUDENT role)
        if (user.getRole().name().equals("STUDENT")) {
            if (user.getStudentId() == null || !lesson.getStudentId().equals(user.getStudentId())) {
                return ResponseEntity.status(403)
                        .body(ApiResponse.error("You don't have permission to access this lesson"));
            }
        }

        // Increment view count
        lessonService.incrementViewCount(id);

        return ResponseEntity.ok(ApiResponse.success(lesson));
    }

    /**
     * Get lessons by month/year
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

        log.info("Student {} filtering lessons: {}/{}", user.getStudentId(), month, year);
        List<LessonResponse> lessons = lessonService.getLessonsByMonthYear(user.getStudentId(), year, month);
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Mark lesson as completed
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        log.info("Student {} marking lesson {} as completed", user.getStudentId(), id);
        LessonResponse lesson = lessonService.markAsCompleted(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked as completed", lesson));
    }

    /**
     * Mark lesson as incomplete
     */
    @PostMapping("/{id}/incomplete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsIncomplete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        log.info("Student {} marking lesson {} as incomplete", user.getStudentId(), id);
        LessonResponse lesson = lessonService.markAsIncomplete(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success("Lesson marked as incomplete", lesson));
    }

    /**
     * Get lesson statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<LessonStatsResponse>> getStats(
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found"));
        }

        log.info("Getting lesson stats for student: {}", user.getStudentId());
        LessonStatsResponse stats = lessonService.getStudentStats(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}