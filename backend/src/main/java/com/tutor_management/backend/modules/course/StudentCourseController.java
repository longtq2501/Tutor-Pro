package com.tutor_management.backend.modules.course;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.course.dto.response.CourseAssignmentResponse;
import com.tutor_management.backend.modules.course.dto.response.StudentCourseDetailResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller providing personalized course views for students.
 */
@RestController
@RequestMapping("/api/student/courses")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentCourseController {

    private final CourseAssignmentService courseAssignmentService;

    /**
     * Lists all courses currently assigned to the authenticated student.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseAssignmentResponse>>> getMyCourses(
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student profile not found for the authenticated user"));
        }

        List<CourseAssignmentResponse> courses = courseAssignmentService.getStudentCourses(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    /**
     * Retrieves the detailed view of a course assigned to the student, including progress status.
     * 
     * @param id Course ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentCourseDetailResponse>> getCourseDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student profile not found for the authenticated user"));
        }

        StudentCourseDetailResponse detail = courseAssignmentService.getStudentCourseDetail(id, user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(detail));
    }
}
