package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Event published when an online live teaching session is ended.
 */
@Getter
@AllArgsConstructor
@Builder
public class OnlineSessionEndedEvent {
    /** Primary key of the online session */
    private final Long sessionId;
    
    /** Unique room ID for the session */
    private final String roomId;
    
    /** ID of the tutor (User ID) */
    private final Long tutorId;
    
    /** ID of the student (User ID) */
    private final Long studentId;
    
    /** Calculated duration of the session in minutes */
    private final Integer durationMinutes;
}
