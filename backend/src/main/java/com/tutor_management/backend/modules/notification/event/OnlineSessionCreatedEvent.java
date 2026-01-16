package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * Event published when a new online live teaching session is created.
 */
@Getter
@AllArgsConstructor
@Builder
public class OnlineSessionCreatedEvent {
    /** Primary key of the online session */
    private final Long sessionId;
    
    /** Unique room ID for the session */
    private final String roomId;
    
    /** ID of the tutor conducting the session */
    private final Long tutorId;
    
    /** Name of the tutor */
    private final String tutorName;
    
    /** ID of the student participating */
    private final Long studentId;
    
    /** Name of the student */
    private final String studentName;
    
    /** Scheduled start time */
    private final LocalDateTime scheduledStart;
}
