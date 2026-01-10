package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.ExerciseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Data access layer for managing student assignments to exercises.
 */
@Repository
public interface ExerciseAssignmentRepository extends JpaRepository<ExerciseAssignment, String> {
    
    /**
     * Lists all assignments for a specific student.
     */
    List<ExerciseAssignment> findByStudentId(String studentId);
    
    /**
     * Lists all students assigned to a specific exercise.
     */
    List<ExerciseAssignment> findByExerciseId(String exerciseId);
    
    /**
     * Retrieves a specific assignment by the student-exercise pair.
     */
    Optional<ExerciseAssignment> findByExerciseIdAndStudentId(String exerciseId, String studentId);
    
    /**
     * Lists all assignments authorized by a specific staff member.
     */
    List<ExerciseAssignment> findByAssignedBy(String assignedBy);

    /**
     * Bulk removes all assignment records for an exercise being deleted.
     */
    @Modifying
    @Query("DELETE FROM ExerciseAssignment ea WHERE ea.exerciseId = :exerciseId")
    void deleteByExerciseId(@Param("exerciseId") String exerciseId);
}
