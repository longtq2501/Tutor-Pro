package com.tutor_management.backend.modules.notification.enums;

/**
 * Categorization of system notifications for UI/UX differentiation.
 */
public enum NotificationType {
    /** Student submitted an exam to tutor */
    EXAM_SUBMITTED,
    
    /** Tutor graded a student's submission */
    EXAM_GRADED,
    
    /** Tutor assigned a new exercise to student */
    EXAM_ASSIGNED,
    
    /** Tutor modified an existing exercise */
    EXAM_UPDATED,
    
    /** New recurring schedule established */
    SCHEDULE_CREATED,
    
    /** Existing recurring schedule modified */
    SCHEDULE_UPDATED,
    
    /** Individual lesson session created */
    SESSION_CREATED,
    
    /** Individual lesson session moved or time changed */
    SESSION_RESCHEDULED,
    
    /** Critical system or security alerts */
    SYSTEM,
    
    /** Miscellaneous notifications */
    GENERAL
}
