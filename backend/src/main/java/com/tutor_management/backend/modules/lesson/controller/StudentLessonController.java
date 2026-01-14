package com.tutor_management.backend.modules.lesson.controller;

import com.tutor_management.backend.modules.lesson.service.LessonService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResponse;
import com.tutor_management.backend.modules.lesson.dto.response.StudentLessonSummaryResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LessonStatsResponse;
import com.tutor_management.backend.modules.auth.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Controller for Student-facing lesson operations.
 * Allows students to view assigned lessons, track progress, and view learning stats.
 * Authorized for: STUDENT, ADMIN.
 */
@RestController
@RequestMapping("/api/student/lessons")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentLessonController {

    private final LessonService lessonService;

    /**
     * Retrieves all lessons assigned to the authenticated student.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentLessonSummaryResponse>>> getAllLessons(
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh cho tài khoản này."));
        }
        return ResponseEntity.ok(ApiResponse.success(lessonService.getStudentLessons(user.getStudentId(), pageable)));
    }

    /**
     * Retrieves details for a specific lesson and records a view event.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh."));
        }

        LessonResponse lesson = lessonService.getLessonById(id, user.getStudentId());
        lessonService.incrementViewCount(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(lesson));
    }

    /**
     * Filters student lessons by month and year.
     */
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<Page<StudentLessonSummaryResponse>>> getLessonsByMonthYear(
            @RequestParam int year,
            @RequestParam int month,
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh."));
        }
        return ResponseEntity.ok(ApiResponse.success(lessonService.getLessonsByMonthYear(user.getStudentId(), year, month, pageable)));
    }

    /**
     * Marks a lesson as completed for the authenticated student.
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsCompleted(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh."));
        }
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu hoàn thành bài học", lessonService.markAsCompleted(id, user.getStudentId())));
    }

    /**
     * Reverts a lesson to 'Incomplete' status for the authenticated student.
     */
    @PostMapping("/{id}/incomplete")
    public ResponseEntity<ApiResponse<LessonResponse>> markAsIncomplete(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh."));
        }
        return ResponseEntity.ok(ApiResponse.success("Đã hủy đánh dấu hoàn thành bài học", lessonService.markAsIncomplete(id, user.getStudentId())));
    }

    /**
     * Retrieves learning statistics for the authenticated student.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<LessonStatsResponse>> getStats(@AuthenticationPrincipal User user) {
        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin học sinh."));
        }
        return ResponseEntity.ok(ApiResponse.success(lessonService.getStudentStats(user.getStudentId())));
    }
}
