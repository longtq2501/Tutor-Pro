package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Exercise;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Exercise entity
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, String> {
    
    /**
     * Find exercises by class ID and status
     */
    List<Exercise> findByClassIdAndStatus(String classId, ExerciseStatus status);
    
    /**
     * Find all exercises by class ID
     */
    List<Exercise> findByClassId(String classId);
    
    /**
     * Find all exercises by created by (teacher ID)
     */
    List<Exercise> findByCreatedBy(String createdBy);
    
    /**
     * Find exercises by class ID and status, ordered by creation date
     */
    List<Exercise> findByClassIdAndStatusOrderByCreatedAtDesc(String classId, ExerciseStatus status);
    
    /**
     * Find all exercises by class ID, ordered by creation date
     */
    List<Exercise> findByClassIdOrderByCreatedAtDesc(String classId);

    /**
     * Find exercise with questions and options eagerly fetched
     */
    @Query("SELECT DISTINCT e FROM Exercise e " +
           "LEFT JOIN FETCH e.questions q " +
           "LEFT JOIN FETCH q.options " +
           "WHERE e.id = :id")
    Optional<Exercise> findByIdWithDetails(@Param("id") String id);
}
