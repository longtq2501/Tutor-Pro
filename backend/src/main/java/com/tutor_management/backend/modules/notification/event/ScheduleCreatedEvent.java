package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalTime;

/**
 * Event published when a new recurring schedule is established for a student.
 */
@Getter
@AllArgsConstructor
@Builder
public class ScheduleCreatedEvent {
    /** Primary key of the new recurring schedule */
    private final Long scheduleId;
    
    /** String ID of the recipient student */
    private final String studentId;
    
    /** Display name of the student */
    private final String studentName;
    
    /** Name of the tutor who created the schedule */
    private final String tutorName;
    
    /** Subject of the lessons (e.g., "Toán 12") */
    private final String subject;
    
    /** Formatted string of days (e.g., "Thứ 2, Thứ 4") */
    private final String daysOfWeek;
    
    /** Daily start time of the recurring sessions */
    private final LocalTime startTime;
}
