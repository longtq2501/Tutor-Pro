package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Data access layer for managing Assessment Questions.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    
    /**
     * Lists questions for an exercise in their presentation order.
     */
    List<Question> findByExerciseIdOrderByOrderIndex(String exerciseId);
    
    /**
     * Fetches questions for an exercise with MCQ options eagerly pre-loaded.
     * Recommended for assessment rendering to avoid lazy loading exceptions.
     */
    @Query("SELECT DISTINCT q FROM Question q " +
           "LEFT JOIN FETCH q.options " +
           "WHERE q.exercise.id = :exerciseId " +
           "ORDER BY q.orderIndex ASC")
    List<Question> findByExerciseIdWithDetails(@Param("exerciseId") String exerciseId);

    /**
     * Bulk removes all questions belonging to a specific exercise.
     * Note: Does NOT automatically remove options unless cascaded in JPA.
     */
    @Modifying
    @Query("DELETE FROM Question q WHERE q.exercise.id = :exerciseId")
    void deleteByExerciseId(@Param("exerciseId") String exerciseId);
}
