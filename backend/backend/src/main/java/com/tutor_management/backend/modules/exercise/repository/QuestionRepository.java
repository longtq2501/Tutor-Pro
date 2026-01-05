package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
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
     * Delete all questions for an exercise
     */
    void deleteByExerciseId(String exerciseId);
}
