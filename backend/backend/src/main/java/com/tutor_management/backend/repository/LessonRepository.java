package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    // ✅ FIX: Remove JOIN FETCH for collections - Let @Fetch annotation handle it
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.student " +
            "WHERE l.student.id = :studentId " +
            "ORDER BY l.lessonDate DESC")
    List<Lesson> findByStudentIdOrderByLessonDateDesc(@Param("studentId") Long studentId);

    // ✅ FIX: For detail view, fetch collections separately or use EntityGraph
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.student " +
            "WHERE l.id = :id")
    Optional<Lesson> findByIdWithDetails(@Param("id") Long id);

    // Get lessons by student and date range
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.student " +
            "WHERE l.student.id = :studentId " +
            "AND l.lessonDate BETWEEN :startDate AND :endDate " +
            "ORDER BY l.lessonDate DESC")
    List<Lesson> findByStudentIdAndDateRange(
            @Param("studentId") Long studentId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Get lessons by month/year
    @Query("SELECT l FROM Lesson l " +
            "LEFT JOIN FETCH l.student " +
            "WHERE l.student.id = :studentId " +
            "AND YEAR(l.lessonDate) = :year " +
            "AND MONTH(l.lessonDate) = :month " +
            "ORDER BY l.lessonDate DESC")
    List<Lesson> findByStudentIdAndYearMonth(
            @Param("studentId") Long studentId,
            @Param("year") int year,
            @Param("month") int month
    );

    // Count total lessons for student
    Long countByStudentId(Long studentId);

    // Count completed lessons
    Long countByStudentIdAndIsCompletedTrue(Long studentId);
}