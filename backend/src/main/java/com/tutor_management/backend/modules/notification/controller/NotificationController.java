package com.tutor_management.backend.modules.notification.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.notification.dto.response.NotificationResponse;
import com.tutor_management.backend.modules.notification.service.NotificationService;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.ApplicationEventPublisher;
import com.tutor_management.backend.modules.notification.event.ExamSubmittedEvent;

import java.util.List;

/**
 * REST controller for managing notification-related operations.
 * 
 * Provides endpoints for fetching, counting, and updating the status of 
 * user notifications.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Fetches the full notification history for the authenticated user.
     * @param user Authenticated user context
     * @return List of all user notifications
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal User user) {
        List<NotificationResponse> notifications = notificationService.getNotifications(user.getId());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    /**
     * Retrieves the current count of unread (new) notifications.
     * Useful for displaying a badge/counter in UI.
     * @param user Authenticated user context
     * @return Long count of unread notifications
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount(user.getId())));
    }

    /**
     * Updates the status of a specific notification to 'read'.
     * @param id Target notification identifier
     * @param user Authenticated user context
     * @return Empty success response
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }

    /**
     * Marks all currently unread notifications for the user as 'read' in bulk.
     * @param user Authenticated user context
     * @return Empty success response
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    /**
     * Utility endpoint to manually trigger a test notification. 
     * Primarily for development and QA verification of SSE pipelines.
     * @param user Authenticated user context
     * @return Description of the action performed
     */
    @PostMapping("/test-trigger")
    public ResponseEntity<ApiResponse<String>> testTrigger(
            @AuthenticationPrincipal User user) {
        
        // Broadcast a synthetic exam submission event targeted at the current user
        eventPublisher.publishEvent(ExamSubmittedEvent.builder()
            .submissionId("dev-test-sub-" + System.currentTimeMillis())
            .studentId("999")
            .studentName("QA Tester")
            .exerciseId("dev-ex-01")
            .exerciseTitle("Clean Code Test Exercise")
            .tutorId(user.getId().toString())
            .build());
        
        return ResponseEntity.ok(ApiResponse.success("Test notification broadcasted to your account."));
    }
}
