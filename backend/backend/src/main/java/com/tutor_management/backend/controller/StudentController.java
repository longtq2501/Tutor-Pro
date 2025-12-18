package com.tutor_management.backend.controller;

//import com.tutor_management.backend.dto.*;
import com.tutor_management.backend.dto.request.StudentRequest;
import com.tutor_management.backend.dto.response.StudentResponse;
import com.tutor_management.backend.entity.Student;
import com.tutor_management.backend.repository.StudentRepository;
import com.tutor_management.backend.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// ============= Student Controller =============
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudent(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.ok(studentService.createStudent(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request
    ) {
        return ResponseEntity.ok(studentService.updateStudent(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<StudentResponse> toggleActive(@PathVariable Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setActive(!student.getActive());
        studentRepository.save(student);
        return ResponseEntity.ok(studentService.convertToResponse(student));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping("/{id}/generate-account")
    public ResponseEntity<Map<String, Object>> generateAccountForStudent(@PathVariable Long id) {
        try {
            Map<String, Object> result = studentService.generateUserAccountForStudent(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Generate accounts for ALL students who don't have accounts yet
     * POST /api/students/generate-all-accounts
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate-all-accounts")
    public ResponseEntity<Map<String, Object>> generateAccountsForAllStudents() {
        try {
            Map<String, Object> result = studentService.generateAccountsForAllStudents();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}