package com.tutor_management.backend.modules.exercise.repository;

import com.tutor_management.backend.modules.exercise.domain.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Data access layer for managing Question Options.
 */
@Repository
public interface OptionRepository extends JpaRepository<Option, String> {
    
    /**
     * Bulk deletes all options associated with any question in a specific exercise.
     * Used for efficient resource cleanup.
     * 
     * @param exerciseId UUID of the exercise whose options should be purged.
     */
    @Modifying
    @Query("DELETE FROM Option o WHERE o.question.id IN (SELECT q.id FROM Question q WHERE q.exercise.id = :exerciseId)")
    void deleteByExerciseId(@Param("exerciseId") String exerciseId);
}
