package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.CreateLessonRequest;
import com.tutor_management.backend.dto.request.UpdateLessonRequest;
import com.tutor_management.backend.dto.response.AdminLessonResponse;
import com.tutor_management.backend.dto.response.ApiResponse;
import com.tutor_management.backend.service.AdminLessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Admin/Tutor Lesson Management
 * Accessible by: ADMIN, TUTOR
 */
@RestController
@RequestMapping("/api/admin/lessons")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class AdminLessonController {

    private final AdminLessonService adminLessonService;

    /**
     * Create lesson for multiple students
     */
    @PostMapping
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> createLesson(
            @Valid @RequestBody CreateLessonRequest request) {

        // ✅ THÊM LOG ĐỂ DEBUG
        log.info("📥 Received create lesson request: {}", request);
        log.info("Student IDs: {}", request.getStudentIds());
        log.info("Lesson Date: {}", request.getLessonDate());

        try {
            List<AdminLessonResponse> lessons = adminLessonService.createLessonForStudents(request);
            return ResponseEntity.ok(ApiResponse.success(lessons));
        } catch (Exception e) {
            log.error("❌ Error creating lesson", e);
            throw e;
        }
    }

    /**
     * Update existing lesson
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLessonRequest request) {

        log.info("Admin updating lesson: {}", id);

        try {
            AdminLessonResponse lesson = adminLessonService.updateLesson(id, request);
            return ResponseEntity.ok(ApiResponse.success("Cập nhật bài giảng thành công", lesson));
        } catch (Exception e) {
            log.error("Failed to update lesson", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể cập nhật: " + e.getMessage()));
        }
    }

    /**
     * Get all lessons (includes drafts)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> getAllLessons() {
        log.info("Admin getting all lessons");
        List<AdminLessonResponse> lessons = adminLessonService.getAllLessons();
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Get lesson by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> getLessonById(@PathVariable Long id) {
        log.info("Admin getting lesson: {}", id);

        try {
            AdminLessonResponse lesson = adminLessonService.getLessonById(id);
            return ResponseEntity.ok(ApiResponse.success(lesson));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Không tìm thấy bài giảng"));
        }
    }

    /**
     * Get lessons by student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> getLessonsByStudent(
            @PathVariable Long studentId) {

        log.info("Admin getting lessons for student: {}", studentId);
        List<AdminLessonResponse> lessons = adminLessonService.getLessonsByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Delete lesson
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long id) {
        log.info("Admin deleting lesson: {}", id);

        try {
            adminLessonService.deleteLesson(id);
            return ResponseEntity.ok(ApiResponse.success("Xóa bài giảng thành công", null));
        } catch (Exception e) {
            log.error("Failed to delete lesson", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể xóa: " + e.getMessage()));
        }
    }

    /**
     * Toggle publish status
     */
    @PutMapping("/{id}/toggle-publish")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> togglePublishStatus(@PathVariable Long id) {
        log.info("Admin toggling publish status for lesson: {}", id);

        try {
            AdminLessonResponse lesson = adminLessonService.togglePublishStatus(id);
            String message = lesson.getIsPublished()
                    ? "Đã xuất bản bài giảng"
                    : "Đã chuyển về bản nháp";
            return ResponseEntity.ok(ApiResponse.success(message, lesson));
        } catch (Exception e) {
            log.error("Failed to toggle publish status", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Không thể thay đổi trạng thái: " + e.getMessage()));
        }
    }
}