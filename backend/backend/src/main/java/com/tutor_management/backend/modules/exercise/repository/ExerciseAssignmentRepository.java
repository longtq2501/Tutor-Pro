package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.ExerciseAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseAssignmentRepository extends JpaRepository<ExerciseAssignment, String> {
    
    List<ExerciseAssignment> findByStudentId(String studentId);
    
    List<ExerciseAssignment> findByExerciseId(String exerciseId);
    
    Optional<ExerciseAssignment> findByExerciseIdAndStudentId(String exerciseId, String studentId);
    
    List<ExerciseAssignment> findByAssignedBy(String assignedBy);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM ExerciseAssignment ea WHERE ea.exerciseId = :exerciseId")
    void deleteByExerciseId(@org.springframework.data.repository.query.Param("exerciseId") String exerciseId);
}
