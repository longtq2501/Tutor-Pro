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
     */
    @Query("SELECT l FROM Lesson l LEFT JOIN FETCH l.assignments ORDER BY l.createdAt DESC")
    List<Lesson> findAllWithAssignments();

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
     * @return List of library lessons.
     */
    List<Lesson> findByIsLibraryTrueOrderByCreatedAtDesc();
}
