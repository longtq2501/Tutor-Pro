package com.tutor_management.backend.modules.submission.repository;

import com.tutor_management.backend.modules.submission.domain.Submission;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Submission entity
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    
    /**
     * Find submissions by exercise ID
     */
    List<Submission> findByExerciseId(String exerciseId);
    
    /**
     * Find submissions by student ID
     */
    List<Submission> findByStudentId(String studentId);
    
    /**
     * Find submission by exercise ID and student ID
     */
    Optional<Submission> findByExerciseIdAndStudentId(String exerciseId, String studentId);
    
    /**
     * Find submissions by exercise ID and status
     */
    List<Submission> findByExerciseIdAndStatus(String exerciseId, SubmissionStatus status);
    
    /**
     * Count submissions by exercise ID
     */
    long countByExerciseId(String exerciseId);
    
    /**
     * Count submissions by exercise ID and status
     */
    long countByExerciseIdAndStatus(String exerciseId, SubmissionStatus status);
}
