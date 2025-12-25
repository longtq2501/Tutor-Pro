package com.tutor_management.backend.modules.student;

import com.tutor_management.backend.modules.finance.dto.response.SessionRecordResponse;
import com.tutor_management.backend.modules.student.dto.response.StudentResponse;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.finance.SessionRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class StudentApiController {

    private final SessionRecordService sessionRecordService;
    private final StudentService studentService;

    /**
     * Get current student's info
     * GET /api/student/me
     */
    @GetMapping("/me")
    public ResponseEntity<StudentResponse> getMyInfo(@AuthenticationPrincipal User user) {
        if (user.getStudentId() == null) {
            throw new RuntimeException("Student ID not linked to user account");
        }

        StudentResponse student = studentService.getStudentById(user.getStudentId());
        return ResponseEntity.ok(student);
    }

    /**
     * Get current student's sessions (optionally filtered by month)
     * GET /api/student/sessions
     * GET /api/student/sessions?month=2025-12
     */
    @GetMapping("/sessions")
    public ResponseEntity<List<SessionRecordResponse>> getMySessions(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String month
    ) {
        if (user.getStudentId() == null) {
            throw new RuntimeException("Student ID not linked to user account");
        }

        List<SessionRecordResponse> sessions;

        if (month != null && !month.isEmpty()) {
            // Get sessions for specific month
            sessions = sessionRecordService.getRecordsByStudentIdAndMonth(user.getStudentId(), month);
        } else {
            // Get all sessions for this student
            sessions = sessionRecordService.getRecordsByStudentId(user.getStudentId());
        }

        return ResponseEntity.ok(sessions);
    }

    /**
     * Get current student's dashboard stats
     * GET /api/student/dashboard?month=2025-12
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @AuthenticationPrincipal User user,
            @RequestParam String month
    ) {
        if (user.getStudentId() == null) {
            throw new RuntimeException("Student ID not linked to user account");
        }

        // Get student's sessions for the month
        List<SessionRecordResponse> sessions = sessionRecordService.getRecordsByStudentIdAndMonth(
                user.getStudentId(),
                month
        );

        // Calculate stats
        int totalSessions = sessions.size();
        long completedSessions = sessions.stream().filter(SessionRecordResponse::getCompleted).count();
        double totalHours = sessions.stream().mapToDouble(SessionRecordResponse::getHours).sum();
        long totalAmount = sessions.stream().mapToLong(SessionRecordResponse::getTotalAmount).sum();
        long paidAmount = sessions.stream()
                .filter(SessionRecordResponse::getPaid)
                .mapToLong(SessionRecordResponse::getTotalAmount)
                .sum();
        long unpaidAmount = totalAmount - paidAmount;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", totalSessions);
        stats.put("completedSessions", completedSessions);
        stats.put("totalHours", totalHours);
        stats.put("totalAmount", totalAmount);
        stats.put("paidAmount", paidAmount);
        stats.put("unpaidAmount", unpaidAmount);

        return ResponseEntity.ok(stats);
    }
}
