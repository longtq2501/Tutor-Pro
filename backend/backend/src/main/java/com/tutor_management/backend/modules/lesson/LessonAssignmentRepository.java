package com.tutor_management.backend.modules.lesson;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LessonAssignmentRepository extends JpaRepository<LessonAssignment, Long> {

    // ❌ OLD: N+1 query problem - loads lesson separately for each assignment
    List<LessonAssignment> findByStudentIdOrderByAssignedDateDesc(Long studentId);

    // ✅ OPTIMIZED: Use @EntityGraph to fetch lesson with category, images, and
    // resources
    @EntityGraph(attributePaths = { "lesson", "lesson.category", "lesson.images", "lesson.resources" })
    @Query("SELECT la FROM LessonAssignment la WHERE la.student.id = :studentId ORDER BY la.assignedDate DESC")
    List<LessonAssignment> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    // ❌ OLD: N+1 query problem
    List<LessonAssignment> findByLessonIdOrderByAssignedDateDesc(Long lessonId);

    // ✅ OPTIMIZED: Use @EntityGraph to fetch student
    @EntityGraph(attributePaths = { "student" })
    @Query("SELECT la FROM LessonAssignment la WHERE la.lesson.id = :lessonId ORDER BY la.assignedDate DESC")
    List<LessonAssignment> findByLessonIdWithDetails(@Param("lessonId") Long lessonId);

    // Find specific assignment
    Optional<LessonAssignment> findByLessonIdAndStudentId(Long lessonId, Long studentId);

    // Check if lesson already assigned to student
    boolean existsByLessonIdAndStudentId(Long lessonId, Long studentId);

    // Count assignments for a lesson
    long countByLessonId(Long lessonId);

    // Get completed assignments count for student
    long countByStudentIdAndIsCompletedTrue(Long studentId);

    // Delete specific assignment
    void deleteByLessonIdAndStudentId(Long lessonId, Long studentId);

    // ✅ OPTIMIZED: Count total lessons for a student without loading list
    long countByStudentId(Long studentId);
}
