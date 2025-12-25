package com.tutor_management.backend.modules.homework;

import com.tutor_management.backend.modules.homework.dto.request.HomeworkGradingRequest;
import com.tutor_management.backend.modules.homework.dto.request.HomeworkRequest;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.homework.dto.response.HomeworkResponse;
import com.tutor_management.backend.modules.homework.dto.response.HomeworkStatsResponse;
import com.tutor_management.backend.modules.homework.Homework.HomeworkStatus;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.homework.HomeworkService;
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
 * Controller for Tutor Homework operations
 * Accessible by: TUTOR, ADMIN
 */
@RestController
@RequestMapping("/api/tutor/homeworks")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('TUTOR', 'ADMIN')")
class TutorHomeworkController {

    private final HomeworkService homeworkService;

    /**
     * Create new homework
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HomeworkResponse>> createHomework(
            @Valid @RequestBody HomeworkRequest request,
            @AuthenticationPrincipal User user) {

        log.info("User {} creating new homework: {} for student: {}",
                user.getEmail(), request.getTitle(), request.getStudentId());

        try {
            HomeworkResponse homework = homeworkService.createHomework(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Homework created successfully", homework));
        } catch (Exception e) {
            log.error("Failed to create homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create homework: " + e.getMessage()));
        }
    }

    /**
     * Update homework
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeworkResponse>> updateHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkRequest request,
            @AuthenticationPrincipal User user) {

        log.info("User {} updating homework: {}", user.getEmail(), id);

        try {
            HomeworkResponse homework = homeworkService.updateHomework(id, request);
            return ResponseEntity.ok(ApiResponse.success("Homework updated successfully", homework));
        } catch (Exception e) {
            log.error("Failed to update homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update homework: " + e.getMessage()));
        }
    }

    /**
     * Grade homework
     */
    @PutMapping("/{id}/grade")
    public ResponseEntity<ApiResponse<HomeworkResponse>> gradeHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkGradingRequest request,
            @AuthenticationPrincipal User user) {

        log.info("User {} grading homework: {} with score: {}",
                user.getEmail(), id, request.getScore());

        try {
            HomeworkResponse homework = homeworkService.gradeHomework(
                    id,
                    request.getScore(),
                    request.getFeedback()
            );
            return ResponseEntity.ok(ApiResponse.success("Homework graded successfully", homework));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to grade homework", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to grade homework: " + e.getMessage()));
        }
    }

    /**
     * Delete homework
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHomework(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        log.info("User {} deleting homework: {}", user.getEmail(), id);

        try {
            homeworkService.deleteHomework(id);
            return ResponseEntity.ok(ApiResponse.success("Homework deleted successfully", null));
        } catch (Exception e) {
            log.error("Failed to delete homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete homework: " + e.getMessage()));
        }
    }

    /**
     * Get all homeworks for a specific student (tutor view)
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getStudentHomeworks(
            @PathVariable Long studentId,
            @AuthenticationPrincipal User user) {

        log.info("User {} getting all homeworks for student: {}", user.getEmail(), studentId);

        try {
            List<HomeworkResponse> homeworks = homeworkService.getStudentHomeworks(studentId);
            return ResponseEntity.ok(ApiResponse.success(homeworks));
        } catch (Exception e) {
            log.error("Failed to get student homeworks", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get homeworks: " + e.getMessage()));
        }
    }

    /**
     * Get homework statistics for a student (tutor view)
     */
    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<ApiResponse<HomeworkStatsResponse>> getStudentHomeworkStats(
            @PathVariable Long studentId,
            @AuthenticationPrincipal User user) {

        log.info("User {} getting homework stats for student: {}", user.getEmail(), studentId);

        try {
            HomeworkStatsResponse stats = homeworkService.getHomeworkStats(studentId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Failed to get student homework stats", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get stats: " + e.getMessage()));
        }
    }

    /**
     * Upload file for homework (tutor can attach files when creating homework)
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {

        try {
            log.info("User {} uploading homework file: {}", user.getEmail(), file.getOriginalFilename());
            String url = homeworkService.uploadHomeworkFile(file);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to upload file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }
}

/**
 * Controller for Admin Homework operations
 * Accessible by: ADMIN only
 * Admin has full access to all homework operations
 */
@RestController
@RequestMapping("/api/admin/homeworks")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
class AdminHomeworkController {

    private final HomeworkService homeworkService;

    /**
     * Get all homeworks for a specific student
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getStudentHomeworks(
            @PathVariable Long studentId) {

        log.info("Admin getting all homeworks for student: {}", studentId);

        try {
            List<HomeworkResponse> homeworks = homeworkService.getStudentHomeworks(studentId);
            return ResponseEntity.ok(ApiResponse.success(homeworks));
        } catch (Exception e) {
            log.error("Failed to get student homeworks", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get homeworks: " + e.getMessage()));
        }
    }

    /**
     * Get homeworks by status for a student
     */
    @GetMapping("/student/{studentId}/status/{status}")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getStudentHomeworksByStatus(
            @PathVariable Long studentId,
            @PathVariable HomeworkStatus status) {

        log.info("Admin getting homeworks with status {} for student: {}", status, studentId);
        List<HomeworkResponse> homeworks = homeworkService.getHomeworksByStatus(studentId, status);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get upcoming homeworks for a student
     */
    @GetMapping("/student/{studentId}/upcoming")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getStudentUpcomingHomeworks(
            @PathVariable Long studentId,
            @RequestParam(required = false, defaultValue = "7") Integer days) {

        log.info("Admin getting upcoming homeworks for student: {}", studentId);
        List<HomeworkResponse> homeworks = homeworkService.getUpcomingHomeworks(studentId, days);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get overdue homeworks for a student
     */
    @GetMapping("/student/{studentId}/overdue")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getStudentOverdueHomeworks(
            @PathVariable Long studentId) {

        log.info("Admin getting overdue homeworks for student: {}", studentId);
        List<HomeworkResponse> homeworks = homeworkService.getOverdueHomeworks(studentId);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Get homework statistics for a student
     */
    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<ApiResponse<HomeworkStatsResponse>> getStudentHomeworkStats(
            @PathVariable Long studentId) {

        log.info("Admin getting homework stats for student: {}", studentId);

        try {
            HomeworkStatsResponse stats = homeworkService.getHomeworkStats(studentId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("Failed to get student homework stats", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get stats: " + e.getMessage()));
        }
    }

    /**
     * Get homework by ID (admin can view any)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeworkResponse>> getHomeworkById(@PathVariable Long id) {
        log.info("Admin getting homework: {}", id);
        HomeworkResponse homework = homeworkService.getHomeworkById(id);
        return ResponseEntity.ok(ApiResponse.success(homework));
    }

    /**
     * Create homework (admin can create for any student)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<HomeworkResponse>> createHomework(
            @Valid @RequestBody HomeworkRequest request) {

        log.info("Admin creating homework: {} for student: {}", request.getTitle(), request.getStudentId());

        try {
            HomeworkResponse homework = homeworkService.createHomework(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Homework created successfully", homework));
        } catch (Exception e) {
            log.error("Failed to create homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create homework: " + e.getMessage()));
        }
    }

    /**
     * Update homework
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeworkResponse>> updateHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkRequest request) {

        log.info("Admin updating homework: {}", id);

        try {
            HomeworkResponse homework = homeworkService.updateHomework(id, request);
            return ResponseEntity.ok(ApiResponse.success("Homework updated successfully", homework));
        } catch (Exception e) {
            log.error("Failed to update homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update homework: " + e.getMessage()));
        }
    }

    /**
     * Grade homework
     */
    @PutMapping("/{id}/grade")
    public ResponseEntity<ApiResponse<HomeworkResponse>> gradeHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkGradingRequest request) {

        log.info("Admin grading homework: {} with score: {}", id, request.getScore());

        try {
            HomeworkResponse homework = homeworkService.gradeHomework(
                    id,
                    request.getScore(),
                    request.getFeedback()
            );
            return ResponseEntity.ok(ApiResponse.success("Homework graded successfully", homework));
        } catch (Exception e) {
            log.error("Failed to grade homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to grade homework: " + e.getMessage()));
        }
    }

    /**
     * Delete homework
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHomework(@PathVariable Long id) {
        log.info("Admin deleting homework: {}", id);

        try {
            homeworkService.deleteHomework(id);
            return ResponseEntity.ok(ApiResponse.success("Homework deleted successfully", null));
        } catch (Exception e) {
            log.error("Failed to delete homework", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete homework: " + e.getMessage()));
        }
    }

    /**
     * Search all homeworks (across all students)
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> searchAllHomeworks(
            @RequestParam Long studentId,
            @RequestParam String keyword) {

        log.info("Admin searching homeworks with keyword: {} for student: {}", keyword, studentId);
        List<HomeworkResponse> homeworks = homeworkService.searchHomeworks(studentId, keyword);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    /**
     * Upload file
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        try {
            log.info("Admin uploading homework file: {}", file.getOriginalFilename());
            String url = homeworkService.uploadHomeworkFile(file);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
        } catch (Exception e) {
            log.error("Failed to upload file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }
}
