package com.tutor_management.backend.modules.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    // ❌ OLD: N+1 query problem
    List<LessonProgress> findByStudentId(Long studentId);

    // ✅ OPTIMIZED: Use @EntityGraph to fetch lesson and student in one query
    @EntityGraph(attributePaths = { "lesson", "student" })
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.student.id = :studentId")
    List<LessonProgress> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    // ❌ OLD: N+1 query problem
    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);

    // ✅ OPTIMIZED: Use @EntityGraph
    @EntityGraph(attributePaths = { "lesson", "student" })
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.student.id = :studentId AND lp.lesson.id = :lessonId")
    Optional<LessonProgress> findByStudentIdAndLessonIdWithDetails(
            @Param("studentId") Long studentId,
            @Param("lessonId") Long lessonId);

    boolean existsByStudentIdAndLessonId(Long studentId, Long lessonId);
}
