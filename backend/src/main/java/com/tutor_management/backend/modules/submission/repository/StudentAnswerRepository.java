package com.tutor_management.backend.modules.submission.repository;

import com.tutor_management.backend.modules.submission.domain.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Data access interface for {@link StudentAnswer} details.
 */
@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, String> {
    
    /**
     * List all answers belonging to a specific submission attempt.
     */
    List<StudentAnswer> findBySubmissionId(String submissionId);
    
    /**
     * Cascading cleanup of answers for a specific submission.
     */
    void deleteBySubmissionId(String submissionId);
}
