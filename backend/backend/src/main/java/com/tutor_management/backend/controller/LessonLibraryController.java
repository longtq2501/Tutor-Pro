package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.AssignLessonRequest;
import com.tutor_management.backend.dto.request.CreateLessonRequest;
import com.tutor_management.backend.dto.response.ApiResponse;
import com.tutor_management.backend.dto.response.LibraryLessonResponse;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.entity.User;
import com.tutor_management.backend.service.LessonLibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/lesson-library")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class LessonLibraryController {

    private final LessonLibraryService libraryService;

    /**
     * Get all lessons in library
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LibraryLessonResponse>>> getAllLessons() {
        List<LibraryLessonResponse> lessons = libraryService.getAllLibraryLessons();
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Get unassigned lessons only
     */
    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponse<List<LibraryLessonResponse>>> getUnassignedLessons() {
        List<LibraryLessonResponse> lessons = libraryService.getUnassignedLessons();
        return ResponseEntity.ok(ApiResponse.success(lessons));
    }

    /**
     * Create new lesson in library
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LibraryLessonResponse>> createLesson(
            @Valid @RequestBody CreateLessonRequest request
    ) {
        var lesson = libraryService.createLibraryLesson(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Lesson created in library",
                LibraryLessonResponse.fromEntity(lesson)
        ));
    }

    /**
     * Assign lesson to students
     */
    @PostMapping("/{lessonId}/assign")
    public ResponseEntity<ApiResponse<String>> assignLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AssignLessonRequest request,
            @AuthenticationPrincipal User user
    ) {
        libraryService.assignLessonToStudents(
                lessonId,
                request.getStudentIds(),
                user.getEmail()
        );

        return ResponseEntity.ok(ApiResponse.success(
                String.format("Lesson assigned to %d students", request.getStudentIds().size())
        ));
    }

    /**
     * Unassign lesson from students
     */
    @PostMapping("/{lessonId}/unassign")
    public ResponseEntity<ApiResponse<String>> unassignLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody AssignLessonRequest request
    ) {
        libraryService.unassignLessonFromStudents(lessonId, request.getStudentIds());

        return ResponseEntity.ok(ApiResponse.success(
                String.format("Lesson unassigned from %d students", request.getStudentIds().size())
        ));
    }

    /**
     * Get students assigned to a lesson
     */
    @GetMapping("/{lessonId}/students")
    public ResponseEntity<ApiResponse<List<Student>>> getAssignedStudents(
            @PathVariable Long lessonId
    ) {
        List<Student> students = libraryService.getAssignedStudents(lessonId);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    /**
     * Delete lesson from library
     */
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long lessonId) {
        libraryService.deleteLibraryLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted from library", null));
    }
}