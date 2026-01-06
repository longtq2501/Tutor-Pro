package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for Option entity
 */
@Repository
public interface OptionRepository extends JpaRepository<Option, String> {
    
    /**
     * Bulk delete all options belonging to an exercise
     */
    @Modifying
    @Query("DELETE FROM Option o WHERE o.question.id IN (SELECT q.id FROM Question q WHERE q.exercise.id = :exerciseId)")
    void deleteByExerciseId(@Param("exerciseId") String exerciseId);
}
