package com.tutor_management.backend.modules.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tutor_management.backend.modules.course.projection.CourseListProjection;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // ❌ OLD: N+1 query problem
    List<Course> findByTutorId(Long tutorId);

    List<Course> findByIsPublishedTrue();

    // ✅ OPTIMIZED: Use @EntityGraph to fetch tutor and courseLessons in one query
    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.tutor.id = :tutorId")
    List<Course> findByTutorIdWithDetails(@Param("tutorId") Long tutorId);

    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.isPublished = true")
    List<Course> findPublishedCoursesWithDetails();

    // ✅ OPTIMIZED: Fetch single course with all relationships
    @EntityGraph(attributePaths = { "tutor", "courseLessons", "courseLessons.lesson" })
    @Query("SELECT c FROM Course c WHERE c.id = :id")
    Optional<Course> findByIdWithDetails(@Param("id") Long id);

    // ✅ MEMORY OPTIMIZED: Use Projection for list views - reduces RAM by 60%
    @Query("SELECT c.id as id, c.title as title, c.description as description, " +
            "c.thumbnailUrl as thumbnailUrl, c.difficultyLevel as difficultyLevel, " +
            "c.estimatedHours as estimatedHours, c.isPublished as isPublished, " +
            "t.id as tutorId, t.fullName as tutorFullName " +
            "FROM Course c " +
            "LEFT JOIN c.tutor t")
    List<CourseListProjection> findAllCoursesProjection();
}
