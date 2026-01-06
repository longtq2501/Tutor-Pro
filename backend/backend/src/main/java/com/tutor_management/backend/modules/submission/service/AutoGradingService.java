package com.tutor_management.backend.modules.submission.service;

import com.tutor_management.backend.modules.submission.domain.Submission;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    int gradeSubmission(Submission submission);
}
