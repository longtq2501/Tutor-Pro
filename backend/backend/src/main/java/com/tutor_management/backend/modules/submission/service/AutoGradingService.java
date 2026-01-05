package com.tutor_management.backend.modules.submission.service;

/**
 * Service interface for auto-grading MCQ questions
 */
public interface AutoGradingService {
    
    /**
     * Auto-grade MCQ questions in a submission
     * 
     * @param submissionId The submission ID to grade
     * @return The MCQ score
     */
    int gradeSubmission(String submissionId);
}
