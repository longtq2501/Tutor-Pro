package com.tutor_management.backend.modules.course.enums;

/**
 * Defines the current state of a student's progress in a course.
 */
public enum AssignmentStatus {
    /** The student has been enrolled but hasn't started any lessons. */
    NOT_STARTED,
    
    /** The student has completed at least one lesson but not all of them. */
    IN_PROGRESS,
    
    /** The student has completed all required lessons in the course. */
    COMPLETED
}
