package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Event published when a discrete lesson session is manually added or auto-generated.
 */
@Getter
@AllArgsConstructor
@Builder
public class SessionCreatedEvent {
    /** Primary key of the new session record */
    private final Long sessionId;
    
    /** ID of the student who will attend the session */
    private final Long studentId;
    
    /** Tutor conducting the session */
    private final String tutorName;
    
    /** Subject of the session */
    private final String subject;
    
    /** Specific date of this session */
    private final LocalDate sessionDate;
    
    /** Start time for this particular date */
    private final LocalTime startTime;
}
