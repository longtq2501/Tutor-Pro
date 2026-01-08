package com.tutor_management.backend.modules.homework;

import com.tutor_management.backend.modules.homework.dto.request.HomeworkStatusUpdateRequest;
import com.tutor_management.backend.modules.homework.dto.request.HomeworkSubmissionRequest;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import com.tutor_management.backend.modules.homework.dto.response.HomeworkResponse;
import com.tutor_management.backend.modules.homework.dto.response.HomeworkStatsResponse;
import com.tutor_management.backend.modules.homework.Homework.HomeworkStatus;
import com.tutor_management.backend.modules.auth.User;
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

@RestController
@RequestMapping("/api/student/homeworks")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
public class StudentHomeworkController {

    private final HomeworkService homeworkService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeworkResponse>>> getAllHomeworks(
            @AuthenticationPrincipal User user) {

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Admin should use /api/admin/homeworks/student/{studentId}"));
        }

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        List<HomeworkResponse> homeworks = homeworkService.getStudentHomeworks(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeworkResponse>> getHomeworkById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        HomeworkResponse homework = homeworkService.getHomeworkById(id);

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

        return ResponseEntity.ok(ApiResponse.success(homework));
    }

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

        List<HomeworkResponse> homeworks = homeworkService.getHomeworksByStatus(user.getStudentId(), status);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

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

        List<HomeworkResponse> homeworks = homeworkService.getUpcomingHomeworks(user.getStudentId(), days);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

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

        List<HomeworkResponse> homeworks = homeworkService.getOverdueHomeworks(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<HomeworkResponse>> updateHomeworkStatus(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkStatusUpdateRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

        try {
            HomeworkResponse homework = homeworkService.updateHomeworkStatus(id, request.getStatus(), user.getStudentId());
            return ResponseEntity.ok(ApiResponse.success("Homework status updated successfully", homework));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<HomeworkResponse>> submitHomework(
            @PathVariable Long id,
            @Valid @RequestBody HomeworkSubmissionRequest request,
            @AuthenticationPrincipal User user) {

        if (user.getStudentId() == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Student ID not found for this user"));
        }

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
     * ✅ FIXED: Upload file endpoint - giống DocumentController
     */
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {

        try {
            log.info("=== HOMEWORK FILE UPLOAD REQUEST ===");
            log.info("📁 File name: {}", file != null ? file.getOriginalFilename() : "NULL");
            log.info("📊 File size: {}", file != null ? file.getSize() : "NULL");
            log.info("📝 Content type: {}", file != null ? file.getContentType() : "NULL");

            // Validate
            if (file == null || file.isEmpty()) {
                log.error("❌ File is null or empty");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("No file uploaded"));
            }

            // Upload
            log.info("☁️ Uploading to Cloudinary...");
            String url = homeworkService.uploadHomeworkFile(file);

            log.info("✅ Upload successful!");
            log.info("🔗 URL: {}", url);

            Map<String, String> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", file.getOriginalFilename());

            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));

        } catch (IllegalArgumentException e) {
            log.error("❌ Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));

        } catch (Exception e) {
            log.error("❌ Upload failed", e);
            log.error("Exception: {} - {}", e.getClass().getName(), e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }

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

        HomeworkStatsResponse stats = homeworkService.getHomeworkStats(user.getStudentId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

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

        List<HomeworkResponse> homeworks = homeworkService.searchHomeworks(user.getStudentId(), keyword);
        return ResponseEntity.ok(ApiResponse.success(homeworks));
    }
}
