package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Event published when a calendar session is converted to an online session.
 */
@Getter
@AllArgsConstructor
@Builder
public class SessionConvertedToOnlineEvent {
    /** Primary key of the updated session record */
    private final Long sessionId;
    
    /** Unique room ID for the new online session */
    private final String roomId;
    
    /** ID of the student participating in the session */
    private final Long studentId;
    
    /** Tutor conducting the session */
    private final String tutorName;
    
    /** Subject of the session */
    private final String subject;
    
    /** Date of the session */
    private final LocalDate sessionDate;
    
    /** Scheduled start time */
    private final LocalTime startTime;
}
