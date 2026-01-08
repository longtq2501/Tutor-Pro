package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Question entity
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {
    
    /**
     * Find all questions for an exercise, ordered by order index
     */
    List<Question> findByExerciseIdOrderByOrderIndex(String exerciseId);
    
    /**
     * Find all questions for an exercise with options eagerly fetched
     */
    @Query("SELECT DISTINCT q FROM Question q " +
           "LEFT JOIN FETCH q.options " +
           "WHERE q.exercise.id = :exerciseId " +
           "ORDER BY q.orderIndex ASC")
    List<Question> findByExerciseIdWithDetails(@Param("exerciseId") String exerciseId);

    /**
     * Delete all questions for an exercise
     */
    @Modifying
    @Query("DELETE FROM Question q WHERE q.exercise.id = :exerciseId")
    void deleteByExerciseId(@Param("exerciseId") String exerciseId);
}
