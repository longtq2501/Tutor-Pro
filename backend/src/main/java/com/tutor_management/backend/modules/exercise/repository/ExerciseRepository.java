package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Exercise;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link Exercise} entities.
 * Includes optimized projection queries for high-performance library browsing.
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, String> {
    
    /**
     * Filter active exercises available for a specific class.
     */
    List<Exercise> findByClassIdAndStatus(String classId, ExerciseStatus status);
    
    /**
     * List all exercises (draft or published) for a specific class.
     */
    List<Exercise> findByClassId(String classId);
    
    /**
     * List all resources created by a specific tutor.
     */
    List<Exercise> findByCreatedBy(String createdBy);
    
    /**
     * Sorted retrieval of active class materials.
     */
    List<Exercise> findByClassIdAndStatusOrderByCreatedAtDesc(String classId, ExerciseStatus status);
    
    /**
     * Sorted retrieval of all class materials.
     */
    List<Exercise> findByClassIdOrderByCreatedAtDesc(String classId);

    /**
     * Deep fetch of an exercise graph including questions and MCQ options.
     * Prevents N+1 database hits during assessment rendering.
     */
    @Query("SELECT DISTINCT e FROM Exercise e " +
           "LEFT JOIN FETCH e.questions q " +
           "LEFT JOIN FETCH q.options " +
           "WHERE e.id = :id")
    Optional<Exercise> findByIdWithDetails(@Param("id") String id);

    /**
     * Optimized projection for the global exercise library.
     * Fetches metadata and question counts without loading full BLOBs or child collections.
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findAllOptimized();

    /**
     * Optimized projection for class-specific exercise lists.
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.classId = :classId " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findByClassIdOptimized(@Param("classId") String classId);

    /**
     * Optimized projection filtered by class and status.
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.classId = :classId AND e.status = :status " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findByClassIdAndStatusOptimized(@Param("classId") String classId, @Param("status") ExerciseStatus status);

    /**
     * Batch projection retrieval for a set of specific exercise UUIDs.
     * Used in dashboard summaries and recommendation engines.
     */
    @Query("SELECT new com.tutor_management.backend.modules.exercise.dto.response.ExerciseListItemResponse(" +
           "e.id, e.title, e.description, e.totalPoints, e.timeLimit, e.deadline, e.status, " +
           "CAST(SIZE(e.questions) AS integer), CAST(0 AS integer), e.createdAt) " +
           "FROM Exercise e " +
           "WHERE e.id IN :ids " +
           "ORDER BY e.createdAt DESC")
    List<ExerciseListItemResponse> findAllByIdOptimized(@Param("ids") List<String> ids);
}
