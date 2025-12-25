// =========================================================================
// FILE 1: HomeworkRepository.java
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.modules.homework;

import com.tutor_management.backend.modules.homework.Homework.HomeworkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {

    // ✅ OPTIMIZED: Join fetch student và session để tránh N+1
    @Query("SELECT h FROM Homework h " +
            "LEFT JOIN FETCH h.student " +
            "LEFT JOIN FETCH h.sessionRecord " +
            "WHERE h.student.id = :studentId " +
            "ORDER BY h.dueDate DESC")
    List<Homework> findByStudentIdOrderByDueDateDesc(@Param("studentId") Long studentId);

    // ✅ OPTIMIZED: By status với join fetch
    @Query("SELECT h FROM Homework h " +
            "LEFT JOIN FETCH h.student " +
            "LEFT JOIN FETCH h.sessionRecord " +
            "WHERE h.student.id = :studentId AND h.status = :status " +
            "ORDER BY h.dueDate DESC")
    List<Homework> findByStudentIdAndStatusOrderByDueDateDesc(
            @Param("studentId") Long studentId,
            @Param("status") HomeworkStatus status
    );

    // ✅ OPTIMIZED: Upcoming homeworks
    @Query("SELECT h FROM Homework h " +
            "LEFT JOIN FETCH h.student " +
            "LEFT JOIN FETCH h.sessionRecord " +
            "WHERE h.student.id = :studentId " +
            "AND h.status IN ('ASSIGNED', 'IN_PROGRESS') " +
            "AND h.dueDate BETWEEN :now AND :endDate " +
            "ORDER BY h.dueDate ASC")
    List<Homework> findUpcomingHomeworks(
            @Param("studentId") Long studentId,
            @Param("now") LocalDateTime now,
            @Param("endDate") LocalDateTime endDate
    );

    // ✅ OPTIMIZED: Overdue homeworks
    @Query("SELECT h FROM Homework h " +
            "LEFT JOIN FETCH h.student " +
            "LEFT JOIN FETCH h.sessionRecord " +
            "WHERE h.student.id = :studentId " +
            "AND h.status = 'OVERDUE' " +
            "ORDER BY h.dueDate DESC")
    List<Homework> findOverdueHomeworks(@Param("studentId") Long studentId);

    // ✅ OPTIMIZED: Search
    @Query("SELECT h FROM Homework h " +
            "LEFT JOIN FETCH h.student " +
            "LEFT JOIN FETCH h.sessionRecord " +
            "WHERE h.student.id = :studentId " +
            "AND (LOWER(h.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(h.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY h.createdAt DESC")
    List<Homework> searchHomeworks(
            @Param("studentId") Long studentId,
            @Param("keyword") String keyword
    );
}
