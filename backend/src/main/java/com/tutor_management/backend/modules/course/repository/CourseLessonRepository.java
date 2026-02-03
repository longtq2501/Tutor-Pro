package com.tutor_management.backend.modules.course.repository;

import java.util.List;
import java.util.Optional;

import com.tutor_management.backend.modules.course.entity.Course;
import com.tutor_management.backend.modules.course.entity.CourseLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link CourseLesson} mapping entities.
 * Manages the sequential ordering of lessons within courses.
 */
@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {

    List<CourseLesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);

    /**
     * Retrieves ordered lessons for a course with lesson content and categories pre-fetched.
     * Uses custom JPQL with JOIN FETCH to eliminate N+1 queries during course content rendering.
     */
    @Query("SELECT cl FROM CourseLesson cl " +
            "LEFT JOIN FETCH cl.lesson l " +
            "LEFT JOIN FETCH l.category " +
            "WHERE cl.course.id = :courseId " +
            "ORDER BY cl.lessonOrder ASC")
    List<CourseLesson> findByCourseIdWithLessonDetails(@Param("courseId") Long courseId);

    /**
     * Bulk deletes all lesson mappings for a specific course.
     * Used during course teardown or full reconfiguration.
     */
    @Modifying
    @Query("DELETE FROM CourseLesson cl WHERE cl.course = :course")
    void deleteAllByCourse(@Param("course") Course course);

    /**
     * Detaches a specific lesson from all courses it belongs to.
     * Part of the "Force Delete" logic.
     */
    @Modifying
    @Query("DELETE FROM CourseLesson cl WHERE cl.lesson.id = :lessonId")
    void deleteByLessonId(@Param("lessonId") Long lessonId);

    /**
     * Finds CourseLesson by course and lesson IDs.
     */
    Optional<CourseLesson> findByCourseIdAndLessonId(Long courseId, Long lessonId);

    /**
     * Finds the next lesson in sequence within a course.
     */
    @Query("""
        SELECT cl FROM CourseLesson cl
        WHERE cl.course.id = :courseId
        AND cl.lessonOrder > :currentOrder
        ORDER BY cl.lessonOrder ASC
        LIMIT 1
        """)
    Optional<CourseLesson> findNextLesson(
            @Param("courseId") Long courseId,
            @Param("currentOrder") Integer currentOrder);

    /**
     * Finds the previous lesson in sequence within a course.
     */
    @Query("""
        SELECT cl FROM CourseLesson cl
        WHERE cl.course.id = :courseId
        AND cl.lessonOrder < :currentOrder
        ORDER BY cl.lessonOrder DESC
        LIMIT 1
        """)
    Optional<CourseLesson> findPreviousLesson(
            @Param("courseId") Long courseId,
            @Param("currentOrder") Integer currentOrder);

    /**
     * Counts total lessons in a course.
     */
    long countByCourseId(Long courseId);
}
