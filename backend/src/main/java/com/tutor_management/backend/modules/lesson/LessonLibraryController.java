package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.lesson.dto.request.AssignLessonRequest;
import com.tutor_management.backend.modules.lesson.dto.request.CreateLessonRequest;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.lesson.dto.response.LibraryLessonResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.auth.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing the Lesson Library.
 * Handles re-usable content and bulk student assignments.
 */
@RestController
@RequestMapping("/api/admin/lesson-library")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class LessonLibraryController {

    private final LessonLibraryService libraryService;

    /**
     * Lists all library lessons.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LibraryLessonResponse>>> getAllLessons() {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getAllLibraryLessons()));
    }

    /**
     * Lists lessons that have not been assigned to any students.
     */
    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponse<List<LibraryLessonResponse>>> getUnassignedLessons() {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getUnassignedLessons()));
    }

    /**
     * Creates a new standalone lesson in the library.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LibraryLessonResponse>> createLesson(
            @Valid @RequestBody CreateLessonRequest request) {
        log.info("Adding lesson to library: {}", request.getTitle());
        return ResponseEntity.ok(ApiResponse.success("Đã thêm bài giảng vào thư viện", libraryService.createLibraryLesson(request)));
    }

    /**
     * Assigns a library lesson to one or more students.
     */
    @PostMapping("/{lessonId}/assign")
    public ResponseEntity<ApiResponse<String>> assignLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AssignLessonRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Assigning lesson {} to {} students", lessonId, request.getStudentIds().size());
        libraryService.assignLessonToStudents(lessonId, request.getStudentIds(), user.getEmail());
        return ResponseEntity.ok(ApiResponse.success(String.format("Đã giao bài giảng cho %d học sinh", request.getStudentIds().size())));
    }

    /**
     * Revokes lesson access from a list of students.
     */
    @PostMapping("/{lessonId}/unassign")
    public ResponseEntity<ApiResponse<String>> unassignLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AssignLessonRequest request) {
        log.info("Unassigning lesson {} from {} students", lessonId, request.getStudentIds().size());
        libraryService.unassignLessonFromStudents(lessonId, request.getStudentIds());
        return ResponseEntity.ok(ApiResponse.success(String.format("Đã hủy giao bài giảng cho %d học sinh", request.getStudentIds().size())));
    }

    /**
     * Retrieves students currently assigned to a lesson.
     */
    @GetMapping("/{lessonId}/students")
    public ResponseEntity<ApiResponse<List<Student>>> getAssignedStudents(@PathVariable Long lessonId) {
        return ResponseEntity.ok(ApiResponse.success(libraryService.getAssignedStudents(lessonId)));
    }

    /**
     * Permanently deletes a lesson from the library.
     */
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId) {
        log.warn("Deleting library lesson ID: {}", lessonId);
        libraryService.deleteLibraryLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa bài giảng khỏi thư viện", null));
    }
}
