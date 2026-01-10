package com.tutor_management.backend.modules.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tutor_management.backend.modules.course.projection.CourseListProjection;

/**
 * Repository interface for managing {@link Course} entities.
 * Supports efficient listing through projections and full metadata retrieval via EntityGraphs.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTutorId(Long tutorId);

    List<Course> findByIsPublishedTrue();

    /**
     * Returns all courses owned by a tutor with pre-fetched lesson metadata.
     */
    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.tutor.id = :tutorId")
    List<Course> findByTutorIdWithDetails(@Param("tutorId") Long tutorId);

    /**
     * Lists all public courses with their constituent lessons pre-loaded.
     */
    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.isPublished = true")
    List<Course> findPublishedCoursesWithDetails();

    /**
     * Fetches a single course with its complete object graph (tutor, lessons).
     */
    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.id = :id")
    Optional<Course> findByIdWithDetails(@Param("id") Long id);

    /**
     * Highly optimized fetch for course listing views.
     * Returns Interface-based projections to minimize memory allocation and SQL result set size.
     */
    @Query("SELECT c.id as id, c.title as title, c.description as description, " +
            "c.thumbnailUrl as thumbnailUrl, c.difficultyLevel as difficultyLevel, " +
            "c.estimatedHours as estimatedHours, c.isPublished as isPublished, " +
            "t.id as tutorId, t.fullName as tutorFullName " +
            "FROM Course c " +
            "LEFT JOIN c.tutor t")
    List<CourseListProjection> findAllCoursesProjection();
}
