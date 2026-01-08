package com.tutor_management.backend.modules.course;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {
    // ❌ OLD: N+1 query problem
    List<CourseLesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);

    // ✅ OPTIMIZED: Use JOIN FETCH to load lesson and category in one query
    @Query("SELECT cl FROM CourseLesson cl " +
            "LEFT JOIN FETCH cl.lesson l " +
            "LEFT JOIN FETCH l.category " +
            "WHERE cl.course.id = :courseId " +
            "ORDER BY cl.lessonOrder ASC")
    List<CourseLesson> findByCourseIdWithLessonDetails(@Param("courseId") Long courseId);

    @Modifying
    @Query("DELETE FROM CourseLesson cl WHERE cl.course = :course")
    void deleteAllByCourse(@Param("course") Course course);
}
