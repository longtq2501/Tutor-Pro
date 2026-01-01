package com.tutor_management.backend.modules.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {
    // ❌ OLD: N+1 query problem
    List<CourseAssignment> findByStudentId(Long studentId);

    List<CourseAssignment> findByCourseId(Long courseId);

    // ✅ OPTIMIZED: Use @EntityGraph to fetch student and course in one query
    @EntityGraph(attributePaths = { "student", "course", "course.tutor" })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.student.id = :studentId")
    List<CourseAssignment> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    @EntityGraph(attributePaths = { "student", "course", "course.tutor" })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.course.id = :courseId")
    List<CourseAssignment> findByCourseIdWithDetails(@Param("courseId") Long courseId);

    // Keep existing method - already optimized
    Optional<CourseAssignment> findByCourseIdAndStudentId(Long courseId, Long studentId);
}
