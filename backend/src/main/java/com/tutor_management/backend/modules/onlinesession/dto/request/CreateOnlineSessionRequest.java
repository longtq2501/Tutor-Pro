package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.tutor_management.backend.annotation.ValidScheduledTime;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request DTO for creating a new online session.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ValidScheduledTime
public class CreateOnlineSessionRequest {

    /**
     * ID of the tutor conducting the session.
     * If null, current authenticated user's tutor ID will be used.
     * Required for admin creating sessions on behalf of tutors.
     */
    private Long tutorId; // Add this (optional for tutors, required for admin)

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Scheduled start time is required")
    @Future(message = "Scheduled start must be in the future")
    private LocalDateTime scheduledStart;

    @NotNull(message = "Scheduled end time is required")
    @Future(message = "Scheduled end must be in the future")
    private LocalDateTime scheduledEnd;
}


