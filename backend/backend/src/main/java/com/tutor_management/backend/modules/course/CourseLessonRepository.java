package com.tutor_management.backend.modules.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseLessonRepository extends JpaRepository<CourseLesson, Long> {
    List<CourseLesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);

    @Modifying
    @Query("DELETE FROM CourseLesson cl WHERE cl.course = :course")
    void deleteAllByCourse(@Param("course") Course course);
}
