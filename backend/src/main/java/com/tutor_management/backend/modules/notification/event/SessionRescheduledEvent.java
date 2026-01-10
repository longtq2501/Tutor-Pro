package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Event published when a specific session's date or time is changed.
 */
@Getter
@AllArgsConstructor
@Builder
public class SessionRescheduledEvent {
    /** ID of the rescheduled session */
    private final Long sessionId;
    
    /** Recipient student identifier */
    private final Long studentId;
    
    /** Tutor who rescheduled the session */
    private final String tutorName;
    
    /** Subject of the session */
    private final String subject;
    
    /** Previous date before the change */
    private final LocalDate oldDate;
    
    /** Previous start time before the change */
    private final LocalTime oldStartTime;
    
    /** New scheduled date */
    private final LocalDate newDate;
    
    /** New scheduled start time */
    private final LocalTime newStartTime;
}
