package com.tutor_management.backend.modules.submission.repository;

import com.tutor_management.backend.modules.submission.domain.Submission;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    /**
     * Find submission by ID with answers eagerly fetched
     */
    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.answers WHERE s.id = :id")
    Optional<Submission> findByIdWithAnswers(@Param("id") String id);

    /**
     * Find submissions by student ID and a list of exercise IDs
     */
    List<Submission> findByStudentIdAndExerciseIdIn(String studentId, List<String> exerciseIds);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM StudentAnswer sa WHERE sa.submission.id IN (SELECT s.id FROM Submission s WHERE s.exerciseId = :exerciseId)")
    void deleteAnswersByExerciseId(@Param("exerciseId") String exerciseId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM Submission s WHERE s.exerciseId = :exerciseId")
    void deleteSubmissionsByExerciseId(@Param("exerciseId") String exerciseId);
}
