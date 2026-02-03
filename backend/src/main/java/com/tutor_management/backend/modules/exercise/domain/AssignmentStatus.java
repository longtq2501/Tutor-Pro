package com.tutor_management.backend.modules.exercise.domain;

/**
 * Represents the current state of a student's engagement with an assigned exercise.
 */
public enum AssignmentStatus {
    /**
     * The exercise has been linked to the student but not yet opened.
     */
    ASSIGNED,
    
    /**
     * Waiting for the student to start.
     */
    PENDING,

    /**
     * The student has started the exercise but has not submitted it yet (DRAFT).
     */
    STARTED,

    /**
     * The student has completed and submitted the exercise.
     */
    SUBMITTED,

    /**
     * The exercise has been graded by a tutor.
     */
    GRADED,

    /**
     * The student has completed and submitted the exercise for review or grading.
     * @deprecated Use SUBMITTED of GRADED for better precision.
     */
    @Deprecated
    COMPLETED
}
