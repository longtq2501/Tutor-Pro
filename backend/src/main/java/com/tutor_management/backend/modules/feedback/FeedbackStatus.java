package com.tutor_management.backend.modules.feedback;

/**
 * Declares the lifecycle states of a session feedback report.
 */
public enum FeedbackStatus {
    /**
     * Initial state. Editable by the tutor, not visible to parents/students.
     */
    DRAFT,

    /**
     * Finalized state. Locked for editing and published for review.
     */
    SUBMITTED
}
