package com.tutor_management.backend.modules.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
    List<CourseAssignment> findByStudentId(Long studentId);

    List<CourseAssignment> findByCourseId(Long courseId);

    java.util.Optional<CourseAssignment> findByCourseIdAndStudentId(Long courseId, Long studentId);
}
