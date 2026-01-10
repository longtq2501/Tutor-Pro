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
     * The student has started the exercise but has not submitted it yet.
     */
    STARTED,

    /**
     * The student has completed and submitted the exercise for review or grading.
     */
    COMPLETED
}
