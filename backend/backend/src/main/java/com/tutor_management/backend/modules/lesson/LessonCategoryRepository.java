package com.tutor_management.backend.modules.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonCategoryRepository extends JpaRepository<LessonCategory, Long> {
    Optional<LessonCategory> findByName(String name);
}
