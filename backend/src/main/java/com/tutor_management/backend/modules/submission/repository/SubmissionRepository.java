package com.tutor_management.backend.modules.submission.repository;

import com.tutor_management.backend.modules.submission.entity.Submission;
import com.tutor_management.backend.modules.submission.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Data access interface for {@link Submission} entities.
 */
@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    
    /**
     * Retrieves all submissions for a specific exercise.
     */
    List<Submission> findByExerciseId(String exerciseId);
    
    /**
     * Retrieves all submissions authored by a specific student.
     */
    List<Submission> findByStudentId(String studentId);
    
    /**
     * Finds a specific submission attempt by student-exercise pair.
     */
    Optional<Submission> findByExerciseIdAndStudentId(String exerciseId, String studentId);

    /**
     * Eagerly fetches a submission with its associated detail records.
     */
    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.answers WHERE s.id = :id")
    Optional<Submission> findByIdWithAnswers(@Param("id") String id);

    /**
     * Batch retrieval of submissions for a student across multiple exercises.
     */
    List<Submission> findByStudentIdAndExerciseIdIn(String studentId, List<String> exerciseIds);

    /**
     * Hard deletes all answer records for a specific exercise's submissions.
     */
    @Modifying
    @Query("DELETE FROM StudentAnswer sa WHERE sa.submission.id IN (SELECT s.id FROM Submission s WHERE s.exerciseId = :exerciseId)")
    void deleteAnswersByExerciseId(@Param("exerciseId") String exerciseId);

    /**
     * Hard deletes all submissions for a specific exercise.
     */
    @Modifying
    @Query("DELETE FROM Submission s WHERE s.exerciseId = :exerciseId")
    void deleteSubmissionsByExerciseId(@Param("exerciseId") String exerciseId);

    /**
     * Aggregates submission counts by status for all students.
     * Used for the Tutor Dashboard student summary view.
     */
    @Query("SELECT s.studentId, s.status, COUNT(s) FROM Submission s GROUP BY s.studentId, s.status")
    List<Object[]> countAllByStudentAndStatus();

    /**
     * Aggregates submission counts by status for a specific list of students.
     */
    @Query("SELECT s.studentId, s.status, COUNT(s) FROM Submission s WHERE s.studentId IN :studentIds GROUP BY s.studentId, s.status")
    List<Object[]> countByStudentIdInAndStatus(@Param("studentIds") List<String> studentIds);
}
