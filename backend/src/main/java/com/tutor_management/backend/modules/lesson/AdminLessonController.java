package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.lesson.dto.request.CreateLessonRequest;
import com.tutor_management.backend.modules.lesson.dto.response.AdminLessonResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Administrative Lesson Management.
 * Provides endpoints for mass creation, global updates, and assignment tracking.
 * Authorized for: ADMIN, TUTOR.
 */
@RestController
@RequestMapping("/api/admin/lessons")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class AdminLessonController {

    private final AdminLessonService adminLessonService;

    /**
     * Creates a new lesson and optionally assigns it to multiple students.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> createLesson(
            @Valid @RequestBody CreateLessonRequest request) {
        log.info("Admin creating lesson: {}", request.getTitle());
        List<AdminLessonResponse> lessons = adminLessonService.createLessonForStudents(request);
        return ResponseEntity.ok(ApiResponse.success("Tạo bài giảng thành công", lessons));
    }

    /**
     * Updates metadata and content for an existing lesson.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateLessonRequest request) {
        log.info("Admin updating lesson ID: {}", id);
        AdminLessonResponse lesson = adminLessonService.updateLesson(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật bài giảng thành công", lesson));
    }

    /**
     * Lists all lessons in the system.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> getAllLessons() {
        return ResponseEntity.ok(ApiResponse.success(adminLessonService.getAllLessons()));
    }

    /**
     * Retrieves full details for a specific lesson by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminLessonService.getLessonById(id)));
    }

    /**
     * Fetches all lessons currently assigned to a specific student.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AdminLessonResponse>>> getLessonsByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(adminLessonService.getLessonsByStudent(studentId)));
    }

    /**
     * Permanently deletes a lesson and its assignments.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long id) {
        log.warn("Admin deleting lesson ID: {}", id);
        adminLessonService.deleteLesson(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bài giảng thành công", null));
    }

    /**
     * Toggles the publication status of a lesson.
     */
    @PutMapping("/{id}/toggle-publish")
    public ResponseEntity<ApiResponse<AdminLessonResponse>> togglePublishStatus(@PathVariable Long id) {
        AdminLessonResponse lesson = adminLessonService.togglePublish(id);
        String message = Boolean.TRUE.equals(lesson.getIsPublished())
                ? "Đã xuất bản bài giảng"
                : "Đã chuyển về bản nháp";
        return ResponseEntity.ok(ApiResponse.success(message, lesson));
    }
}
