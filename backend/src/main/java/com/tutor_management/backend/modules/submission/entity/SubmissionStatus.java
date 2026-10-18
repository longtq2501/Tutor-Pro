package com.tutor_management.backend.modules.submission.entity;

/**
 * Defines the lifecycle states of a {@link Submission}.
 */
public enum SubmissionStatus {
    /**
     * The exercise has been assigned to the student, but they haven't started it yet.
     */
    PENDING,

    /**
     * Work in progress by the student; not yet visible to the tutor for grading.
     */
    DRAFT,
    
    /**
     * Finalized and submitted by the student; awaiting tutor review.
     */
    SUBMITTED,

    /**
     * The assignment deadline elapsed and the system collected the attempt
     * automatically. The student did NOT actively submit their work.
     * Kept distinct from {@link #SUBMITTED} so tutors can tell a blank,
     * auto-collected attempt apart from a genuine submission.
     */
    AUTO_SUBMITTED,

    /**
     * Grading complete; final scores and feedback available to the student.
     */
    GRADED
}
