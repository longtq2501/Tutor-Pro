package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Exercise;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse;

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

    @Query("SELECT DISTINCT e FROM Exercise e " +
           "LEFT JOIN FETCH e.questions q " +
           "LEFT JOIN FETCH q.options " +
           "WHERE e.id = :id")
    Optional<Exercise> findByIdWithDetails(@Param("id") String id);

    /**
     * Optimized query to fetch exercise metadata and question count in one go
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findAllOptimized();

    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.classId = :classId " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findByClassIdOptimized(@Param("classId") String classId);

    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.classId = :classId AND e.status = :status " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findByClassIdAndStatusOptimized(@Param("classId") String classId, @Param("status") ExerciseStatus status);

    /**
     * Optimized query to fetch exercises by IDs with question counts
     * This avoids N+1 queries when fetching multiple exercises
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.id IN :ids " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findAllByIdOptimized(@Param("ids") List<String> ids);
}
