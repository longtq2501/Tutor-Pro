package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.LessonAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonAssignmentRepository extends JpaRepository<LessonAssignment, Long> {

    // Find all assignments for a student
    List<LessonAssignment> findByStudentIdOrderByAssignedDateDesc(Long studentId);

    // Find all assignments for a lesson
    List<LessonAssignment> findByLessonIdOrderByAssignedDateDesc(Long lessonId);

    // Find specific assignment
    Optional<LessonAssignment> findByLessonIdAndStudentId(Long lessonId, Long studentId);

    // Check if lesson already assigned to student
    boolean existsByLessonIdAndStudentId(Long lessonId, Long studentId);

    // Count assignments for a lesson
    long countByLessonId(Long lessonId);

    // Get completed assignments count for student
    long countByStudentIdAndIsCompletedTrue(Long studentId);

    // Delete all assignments for a lesson
    void deleteByLessonId(Long lessonId);

    // Delete specific assignment
    void deleteByLessonIdAndStudentId(Long lessonId, Long studentId);
}