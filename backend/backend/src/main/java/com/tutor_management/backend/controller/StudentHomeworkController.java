package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.HomeworkStatusUpdateRequest;
import com.tutor_management.backend.dto.request.HomeworkSubmissionRequest;
import com.tutor_management.backend.dto.response.ApiResponse;
import com.tutor_management.backend.dto.response.HomeworkResponse;
import com.tutor_management.backend.dto.response.HomeworkStatsResponse;
import com.tutor_management.backend.entity.Homework.HomeworkStatus;
import com.tutor_management.backend.entity.User;
import com.tutor_management.backend.service.HomeworkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for Student Homework operations
 * Accessible by: STUDENT, ADMIN
 */
@RestController
@RequestMapping("/api/student/homeworks")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentHomeworkController {

    private final HomeworkService homeworkService;

    /**
     * Get all homeworks for current student
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getAllHomeworks(
            @AuthenticationPrincipal User user) {

        // ADMIN can view, but needs studentId parameter
        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}"));
        }

        if (user.getStudentId() == null) {
            log.error("Student ID not found for user: {}", user.getEmail());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Getting all homeworks for student: {}", user.getStudentId());
        List<HomeworkResponse> homeworks = homeworkService.getStudentHomeworks(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get homework by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeworkResponse>> getHomeworkById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        log.info("Getting homework {} for user: {}", id, user.getEmail());
        HomeworkResponse homework = homeworkService.getHomeworkById(id);

        // STUDENT: Verify ownership
        if (user.getRole().name().equals("STUDENT")) {
            if (user.getStudentId() == null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Student ID not found for this user"));
            }
            if (!homework.getStudentId().equals(user.getStudentId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("You don't have permission to access this homework"));
            }
        }
        // ADMIN: Can view all

        return ResponseEntity.ok(ApiResponse.success(homework));
    }

    /**
     * Get homeworks by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getHomeworksByStatus(
            @PathVariable HomeworkStatus status,
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}/status/{status}"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Getting homeworks with status {} for student: {}", status, user.getStudentId());
        List<HomeworkResponse> homeworks = homeworkService.getHomeworksByStatus(user.getStudentId(), status);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get upcoming homeworks (due within X days)
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getUpcomingHomeworks(
            @RequestParam(required = false, defaultValue = "7") Integer days,
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}/upcoming"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Getting upcoming homeworks (within {} days) for student: {}", days, user.getStudentId());
        List<HomeworkResponse> homeworks = homeworkService.getUpcomingHomeworks(user.getStudentId(), days);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get overdue homeworks
     */
    @GetMapping("/overdue")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getOverdueHomeworks(
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}/overdue"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Getting overdue homeworks for student: {}", user.getStudentId());
        List<HomeworkResponse> homeworks = homeworkService.getOverdueHomeworks(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Update homework status (student marks as IN_PROGRESS)
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STUDENT')") // Only STUDENT can update their own status
    public ResponseEntity<ApiResponse<HomeworkResponse>> updateHomeworkStatus(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkStatusUpdateRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Updating homework {} status to {} for student: {}", id, request.getStatus(), user.getStudentId());

        try {
            HomeworkResponse homework = homeworkService.updateHomeworkStatus(id, request.getStatus(), user.getStudentId());
            return ResponseEntity.ok(ApiResponse.success("Homework status updated successfully", homework));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Submit homework
     */
    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')") // Only STUDENT can submit
    public ResponseEntity<ApiResponse<HomeworkResponse>> submitHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkSubmissionRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Student {} submitting homework {}", user.getStudentId(), id);

        try {
            HomeworkResponse homework = homeworkService.submitHomework(
                    id,
                    request.getSubmissionNotes(),
                    request.getSubmissionUrls(),
                    user.getStudentId()
            );
            return ResponseEntity.ok(ApiResponse.success("Homework submitted successfully", homework));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Upload file for homework submission
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        try {
            // ✅ THÊM DETAILED LOGGING
            log.info("=== UPLOAD REQUEST RECEIVED ===");
            log.info("File name: {}", file != null ? file.getOriginalFilename() : "NULL");
            log.info("File size: {}", file != null ? file.getSize() : "NULL");
            log.info("File type: {}", file != null ? file.getContentType() : "NULL");
            log.info("Is empty: {}", file != null ? file.isEmpty() : "NULL");

            // ✅ NULL CHECK
            if (file == null) {
                log.error("File parameter is NULL!");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No file uploaded - file parameter is null"));
            }

            if (file.isEmpty()) {
                log.error("File is empty!");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Uploaded file is empty"));
            }

            log.info("Calling homeworkService.uploadHomeworkFile...");
            String url = homeworkService.uploadHomeworkFile(file);
            log.info("Upload successful! URL: {}", url);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Upload failed with exception", e);
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Stack trace:", e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }

    /**
     * Get homework statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<HomeworkStatsResponse>> getHomeworkStats(
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}/stats"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Getting homework stats for student: {}", user.getStudentId());
        HomeworkStatsResponse stats = homeworkService.getHomeworkStats(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * Search homeworks
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> searchHomeworks(
            @RequestParam String keyword,
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/search"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        log.info("Searching homeworks with keyword: {} for student: {}", keyword, user.getStudentId());
        List<HomeworkResponse> homeworks = homeworkService.searchHomeworks(user.getStudentId(), keyword);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }
}