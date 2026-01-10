package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalTime;

/**
 * Event published when an existing recurring schedule is modified.
 */
@Getter
@AllArgsConstructor
@Builder
public class ScheduleUpdatedEvent {
    /** ID of the updated schedule record */
    private final Long scheduleId;
    
    /** ID of the student the schedule belongs to */
    private final String studentId;
    
    /** Name of the student */
    private final String studentName;
    
    /** Name of the tutor who made the change */
    private final String tutorName;
    
    /** Associated subject */
    private final String subject;
    
    /** Updated weekly slot string */
    private final String daysOfWeek;
    
    /** Updated start time */
    private final LocalTime startTime;
}
