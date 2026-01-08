package com.tutor_management.backend.modules.course;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.course.dto.request.AssignCourseRequest;
import com.tutor_management.backend.modules.course.dto.request.CourseRequest;
import com.tutor_management.backend.modules.course.dto.response.CourseAssignmentResponse;
import com.tutor_management.backend.modules.course.dto.response.CourseDetailResponse;
import com.tutor_management.backend.modules.course.dto.response.CourseResponse;
import com.tutor_management.backend.modules.course.projection.CourseListProjection;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/admin/courses")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class CourseController {

    private final CourseService courseService;
    private final CourseAssignmentService courseAssignmentService;

    // ✅ OPTIMIZED: Returns Projection instead of full entity
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseListProjection>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailResponse>> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCourseById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User user) {
        CourseResponse course = courseService.createCourse(request, user);
        return ResponseEntity.ok(ApiResponse.success("Tạo khóa học thành công", course));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequest request) {
        CourseResponse course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khóa học thành công", course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khóa học thành công", null));
    }

    @PostMapping("/{id}/lessons")
    public ResponseEntity<ApiResponse<Void>> addLessonsToCourse(
            @PathVariable Long id,
            @RequestBody List<Long> lessonIds) {
        courseService.addLessonsToCourse(id, lessonIds);
        return ResponseEntity.ok(ApiResponse.success("Thêm bài giảng vào khóa học thành công", null));
    }

    @DeleteMapping("/{id}/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> removeLessonFromCourse(
            @PathVariable Long id,
            @PathVariable Long lessonId) {
        courseService.removeLessonFromCourse(id, lessonId);
        return ResponseEntity.ok(ApiResponse.success("Xóa bài giảng khỏi khóa học thành công", null));
    }

    // --- ENROLLMENT (ASSIGNMENT) ENDPOINTS ---

    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<List<CourseAssignmentResponse>>> assignCourse(
            @PathVariable Long id,
            @Valid @RequestBody AssignCourseRequest request,
            @AuthenticationPrincipal User user) {
        List<CourseAssignmentResponse> assignments = courseAssignmentService.assignCourseToStudents(id, request,
                user.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Giao khóa học thành công", assignments));
    }

    @GetMapping("/{id}/assignments")
    public ResponseEntity<ApiResponse<List<CourseAssignmentResponse>>> getCourseAssignments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(courseAssignmentService.getCourseAssignments(id)));
    }

    @DeleteMapping("/{id}/students/{studentId}")
    public ResponseEntity<ApiResponse<Void>> removeStudentFromCourse(
            @PathVariable Long id,
            @PathVariable Long studentId) {
        courseAssignmentService.removeStudentFromCourse(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Thu hồi khóa học thành công", null));
    }
}
