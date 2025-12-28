package com.tutor_management.backend.modules.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTutorId(Long tutorId);

    List<Course> findByIsPublishedTrue();
}
