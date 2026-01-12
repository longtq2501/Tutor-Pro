package com.tutor_management.backend.modules.student;

import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.finance.SessionRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Self-service API for students to access their own records and dashboard.
 * Requires STUDENT role and a linked Student ID.
 */
@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('STUDENT')")
public class StudentApiController {

    private final SessionRecordService sessionRecordService;
    private final StudentService studentService;

    /**
     * Retrieves the profile info of the currently authenticated student.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> getMyInfo(@AuthenticationPrincipal User user) {
        ensureStudentLinked(user);
        StudentResponse student = studentService.getStudentById(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    /**
     * Retrieves attendance and billing records for the authenticated student.
     * Optionally filtered by month (YYYY-MM).
     */
    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<Object>> getMySessions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String month,
            Pageable pageable
    ) {
        ensureStudentLinked(user);
        if (month != null && !month.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(
                    sessionRecordService.getRecordsByStudentIdAndMonth(user.getStudentId(), month)));
        }
        return ResponseEntity.ok(ApiResponse.success(
                sessionRecordService.getRecordsByStudentId(user.getStudentId(), pageable)));
    }

    /**
     * Retrieves high-level dashboard metrics for the student's current activity.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(
            @AuthenticationPrincipal User user,
            @RequestParam String month
    ) {
        ensureStudentLinked(user);
        List<SessionRecordResponse> sessions = sessionRecordService.getRecordsByStudentIdAndMonth(user.getStudentId(), month);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", sessions.size());
        stats.put("completedSessions", sessions.stream().filter(SessionRecordResponse::getCompleted).count());
        stats.put("totalHours", sessions.stream().mapToDouble(SessionRecordResponse::getHours).sum());
        stats.put("totalAmount", sessions.stream().mapToLong(SessionRecordResponse::getTotalAmount).sum());
        stats.put("paidAmount", sessions.stream().filter(SessionRecordResponse::getPaid).mapToLong(SessionRecordResponse::getTotalAmount).sum());
        stats.put("unpaidAmount", (long)stats.get("totalAmount") - (long)stats.get("paidAmount"));

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private void ensureStudentLinked(User user) {
        if (user.getStudentId() == null) {
            log.error("User ID {} is not linked to any student account", user.getId());
            throw new IllegalStateException("Tài khoản người dùng chưa được liên kết với hồ sơ học sinh");
        }
    }
}
