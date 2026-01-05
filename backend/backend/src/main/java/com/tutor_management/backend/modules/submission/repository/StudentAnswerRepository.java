package com.tutor_management.backend.modules.submission.repository;

import com.tutor_management.backend.modules.submission.domain.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for StudentAnswer entity
 */
@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, String> {
    
    /**
     * Find answers by submission ID
     */
    List<StudentAnswer> findBySubmissionId(String submissionId);
    
    /**
     * Delete answers by submission ID
     */
    void deleteBySubmissionId(String submissionId);
}
