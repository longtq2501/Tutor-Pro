package com.tutor_management.backend.modules.lesson;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link LessonAssignment} entities.
 * Uses @EntityGraph strategies to solve N+1 problems during progress tracking.
 */
@Repository
public interface LessonAssignmentRepository extends JpaRepository<LessonAssignment, Long> {

    /**
     * Retrieves all assignments for a student with lesson and category details eagerly fetched.
     */
    @EntityGraph(attributePaths = { "lesson", "lesson.category" })
    @Query("SELECT la FROM LessonAssignment la WHERE la.student.id = :studentId ORDER BY la.assignedDate DESC")
    org.springframework.data.domain.Page<LessonAssignment> findByStudentIdWithDetails(@Param("studentId") Long studentId, org.springframework.data.domain.Pageable pageable);

    /**
     * Filters student lessons by month and year with pagination.
     */
    @EntityGraph(attributePaths = { "lesson", "lesson.category" })
    @Query("SELECT la FROM LessonAssignment la WHERE la.student.id = :studentId " +
           "AND YEAR(la.lesson.lessonDate) = :year AND MONTH(la.lesson.lessonDate) = :month " +
           "ORDER BY la.lesson.lessonDate DESC")
    org.springframework.data.domain.Page<LessonAssignment> findByStudentIdAndMonthYear(
            @Param("studentId") Long studentId, 
            @Param("year") int year, 
            @Param("month") int month, 
            org.springframework.data.domain.Pageable pageable);

    /**
     * Retrieves all assignments for a student ordered by assignment date.
     * Simplified version without eager fetching - use when full lesson details are not needed.
     */
    org.springframework.data.domain.Page<LessonAssignment> findByStudentIdOrderByAssignedDateDesc(Long studentId, org.springframework.data.domain.Pageable pageable);

    /**
     * Retrieves all student assignments for a specific lesson.
     */
    @EntityGraph(attributePaths = { "student" })
    @Query("SELECT la FROM LessonAssignment la WHERE la.lesson.id = :lessonId ORDER BY la.assignedDate DESC")
    List<LessonAssignment> findByLessonIdWithDetails(@Param("lessonId") Long lessonId);

    /**
     * Checks for an existing assignment for a specific lesson-student pair.
     */
    @EntityGraph(attributePaths = { "lesson" })
    Optional<LessonAssignment> findByLessonIdAndStudentId(Long lessonId, Long studentId);

    /**
     * Quick check for assignment existence.
     */
    boolean existsByLessonIdAndStudentId(Long lessonId, Long studentId);

    /**
     * Counts how many students have been assigned a specific lesson.
     */
    long countByLessonId(Long lessonId);

    /**
     * Counts completed assignments for a student.
     */
    long countByStudentIdAndIsCompletedTrue(Long studentId);

    /**
     * Removes a specific assignment link.
     */
    void deleteByLessonIdAndStudentId(Long lessonId, Long studentId);

    /**
     * Counts total assignments for a student without loading entity data.
     */
    long countByStudentId(Long studentId);
}
