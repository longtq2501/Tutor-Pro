package com.tutor_management.backend.modules.course;

import java.util.List;

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
}
