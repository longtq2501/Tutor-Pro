package com.tutor_management.backend.modules.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    // Get all library lessons (not assigned yet)
    List<Lesson> findByIsLibraryTrueOrderByCreatedAtDesc();

    @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.assignments ORDER BY l.createdAt DESC")
    List<Lesson> findAllWithAssignments();
}
