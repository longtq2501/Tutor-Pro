package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    // ===== LIBRARY QUERIES =====

    // Get all library lessons (not assigned yet)
    List<Lesson> findByIsLibraryTrueOrderByCreatedAtDesc();

    // Get all published library lessons
    List<Lesson> findByIsLibraryTrueAndIsPublishedTrueOrderByCreatedAtDesc();

    // Get all assigned lessons
    List<Lesson> findByIsLibraryFalseOrderByCreatedAtDesc();

    // Search library lessons
    @Query("SELECT l FROM Lesson l WHERE l.isLibrary = true AND " +
            "(LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Lesson> searchLibraryLessons(@Param("keyword") String keyword);

    // ===== ASSIGNMENT QUERIES =====

    // Get lessons assigned to a student (via assignments)
    @Query("SELECT DISTINCT l FROM Lesson l " +
            "JOIN l.assignments a " +
            "WHERE a.student.id = :studentId " +
            "ORDER BY a.assignedDate DESC")
    List<Lesson> findByStudentId(@Param("studentId") Long studentId);

    // Get lesson with assignments
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.assignments " +
            "WHERE l.id = :lessonId")
    Optional<Lesson> findByIdWithAssignments(@Param("lessonId") Long lessonId);

    // Get lesson with all details
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.images " +
            "LEFT JOIN FETCH l.resources " +
            "WHERE l.id = :lessonId")
    Optional<Lesson> findByIdWithDetails(@Param("lessonId") Long lessonId);

    @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.assignments ORDER BY l.createdAt DESC")
    List<Lesson> findAllWithAssignments();

    // ===== STATS =====

    // Count library lessons
    long countByIsLibraryTrue();

    // Count assigned lessons
    long countByIsLibraryFalse();
}