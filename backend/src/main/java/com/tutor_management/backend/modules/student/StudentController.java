package com.tutor_management.backend.modules.student;

import com.tutor_management.backend.modules.student.dto.request.StudentRequest;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Administrative controller for student lifecycle management.
 * Provides endpoints for creating, updating, and administrative oversight of students.
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;

    /**
     * Retrieves the complete student registry.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(studentService.getAllStudents()));
    }

    /**
     * Retrieves a detailed student profile.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentById(id)));
    }

    /**
     * Registers a new student in the system.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentRequest request) {
        log.info("Creating student: {}", request.getName());
        StudentResponse student = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới học sinh thành công", student));
    }

    /**
     * Updates an existing student's profile and links.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request
    ) {
        log.info("Updating student ID: {}", id);
        StudentResponse student = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin học sinh thành công", student));
    }

    /**
     * Destructive removal of a student and all associated data.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        log.warn("Deleting student ID: {}", id);
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa học sinh thành công", null));
    }

    /**
     * Toggles the active status of a student.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<StudentResponse>> toggleActive(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy học sinh"));
        student.setActive(!student.getActive());
        studentRepository.save(student);
        return ResponseEntity.ok(ApiResponse.success("Đã chuyển đổi trạng thái học sinh", studentService.convertToResponse(student)));
    }

    /**
     * Manually triggers user account generation for a student.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/{id}/generate-account")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateAccountForStudent(@PathVariable Long id) {
        Map<String, Object> result = studentService.generateUserAccountForStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Tạo tài khoản thành công", result));
    }

    /**
     * Bulk triggers account generation for all students missing logins.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate-all-accounts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateAccountsForAllStudents() {
        Map<String, Object> result = studentService.generateAccountsForAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Đã tạo hàng loạt tài khoản", result));
    }
}
