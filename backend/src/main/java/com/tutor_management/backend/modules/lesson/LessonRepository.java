package com.tutor_management.backend.modules.lesson;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tutor_management.backend.modules.lesson.projection.LessonSummaryProjection;

/**
 * Repository interface for {@link Lesson} entities.
 * Implements memory-efficient projection strategies for library browsing.
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    /**
     * Retrieves all lessons with their associated student assignments.
     * Use Pageable for efficient memory management in administrative views.
     */
    @Query("SELECT DISTINCT l FROM Lesson l LEFT JOIN FETCH l.assignments ORDER BY l.createdAt DESC")
    org.springframework.data.domain.Page<Lesson> findAllWithAssignments(org.springframework.data.domain.Pageable pageable);

    /**
     * Retrieves a memory-optimized summary of all published library lessons.
     * Uses projection to significantly reduce RAM usage.
     */
    @Query("SELECT l.id as id, l.title as title, l.summary as summary, " +
            "l.thumbnailUrl as thumbnailUrl, l.difficultyLevel as difficultyLevel, " +
            "l.durationMinutes as durationMinutes, l.lessonDate as lessonDate, " +
            "l.isPublished as isPublished, l.videoUrl as videoUrl, " +
            "l.category as category, l.points as points, l.passScore as passScore, " +
            "l.averageRating as averageRating, l.reviewCount as reviewCount " +
            "FROM Lesson l " +
            "LEFT JOIN l.category " +
            "WHERE l.isLibrary = true AND l.isPublished = true " +
            "ORDER BY l.createdAt DESC")
    List<LessonSummaryProjection> findLibraryLessonsSummary();

    /**
     * Paginated version of the library summary. Use Slice to avoid redundant COUNT queries.
     */
    @Query("SELECT l.id as id, l.title as title, l.summary as summary, " +
            "l.thumbnailUrl as thumbnailUrl, l.difficultyLevel as difficultyLevel, " +
            "l.durationMinutes as durationMinutes, l.lessonDate as lessonDate, " +
            "l.isPublished as isPublished, l.videoUrl as videoUrl, " +
            "l.category as category, l.points as points, l.passScore as passScore, " +
            "l.averageRating as averageRating, l.reviewCount as reviewCount " +
            "FROM Lesson l " +
            "LEFT JOIN l.category " +
            "WHERE l.isLibrary = true AND l.isPublished = true " +
            "ORDER BY l.createdAt DESC")
    Slice<LessonSummaryProjection> findLibraryLessonsSummaryPaginated(Pageable pageable);

    /**
     * Retrieves all library lessons as full entities (not projections).
     * Returns lessons ordered by creation date (newest first).
     * 
     * @param pageable The pagination information.
     * @return Page of library lessons.
     */
    org.springframework.data.domain.Page<Lesson> findByIsLibraryTrueOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    /**
     * Retrieves a lesson by ID with all associated collections eagerly fetched.
     * Uses JOIN FETCH to prevent N+1 queries when accessing images, resources, and category.
     * 
     * @param id The lesson ID
     * @return Optional containing the lesson with initialized collections
     */
    @Query("SELECT DISTINCT l FROM Lesson l " +
           "LEFT JOIN FETCH l.images " +
           "LEFT JOIN FETCH l.resources " +
           "LEFT JOIN FETCH l.category " +
           "WHERE l.id = :id")
    java.util.Optional<Lesson> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") Long id);
}
