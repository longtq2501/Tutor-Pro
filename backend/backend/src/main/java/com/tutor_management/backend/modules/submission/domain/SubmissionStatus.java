package com.tutor_management.backend.modules.submission.domain;

/**
 * Status of a submission
 */
public enum SubmissionStatus {
    /**
     * Student is working on the submission, not yet submitted
     */
    DRAFT,
    
    /**
     * Student has submitted, waiting for grading
     */
    SUBMITTED,
    
    /**
     * Teacher has graded the submission
     */
    GRADED
}
