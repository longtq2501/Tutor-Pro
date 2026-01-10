package com.tutor_management.backend.modules.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing {@link CourseAssignment} entities.
 * Includes optimized queries to prevent N+1 performance issues during progress tracking.
 */
@Repository
public interface CourseAssignmentRepository extends JpaRepository<CourseAssignment, Long> {

    List<CourseAssignment> findByStudentId(Long studentId);

    List<CourseAssignment> findByCourseId(Long courseId);

    /**
     * Fetches course assignments for a student with detailed tutor and course info.
     * Uses EntityGraph to fetch relationships in a single optimized SQL join.
     */
    @EntityGraph(attributePaths = { "student", "course", "course.tutor" })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.student.id = :studentId")
    List<CourseAssignment> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    /**
     * Fetches course assignments for a specific course with student details.
     * Prevents lazy loading issues when listing enrolled students.
     */
    @EntityGraph(attributePaths = { "student", "course", "course.tutor" })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.course.id = :courseId")
    List<CourseAssignment> findByCourseIdWithDetails(@Param("courseId") Long courseId);

    Optional<CourseAssignment> findByCourseIdAndStudentId(Long courseId, Long studentId);

    /**
     * Performs a deep fetch of a single assignment including all course lessons.
     * This is critical for computing real-time progress percentages without additional queries.
     */
    @EntityGraph(attributePaths = { 
        "student", "course", "course.tutor", 
        "course.courseLessons", "course.courseLessons.lesson" 
    })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.course.id = :courseId AND ca.student.id = :studentId")
    Optional<CourseAssignment> findByCourseIdAndStudentIdWithFullDetails(
            @Param("courseId") Long courseId,
            @Param("studentId") Long studentId);

    /**
     * Loads all course enrollments for a student including nested lessons.
     * Optimizes bulk progress calculation for dashboard views.
     */
    @EntityGraph(attributePaths = { "student", "course", "course.courseLessons", "course.courseLessons.lesson" })
    @Query("SELECT ca FROM CourseAssignment ca WHERE ca.student.id = :studentId")
    List<CourseAssignment> findByStudentIdWithCourseLessons(@Param("studentId") Long studentId);
}
