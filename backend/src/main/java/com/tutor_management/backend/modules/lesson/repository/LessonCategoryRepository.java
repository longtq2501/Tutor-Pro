package com.tutor_management.backend.modules.lesson.repository;

import com.tutor_management.backend.modules.lesson.entity.LessonCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for {@link LessonCategory} management.
 */
@Repository
public interface LessonCategoryRepository extends JpaRepository<LessonCategory, Long> {
    
    /**
     * Finds a category by its unique display name.
     */
    Optional<LessonCategory> findByName(String name);
}
