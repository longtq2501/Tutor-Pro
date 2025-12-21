// =========================================================================
// FILE 5: RecurringScheduleRepository.java
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.RecurringSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringScheduleRepository extends JpaRepository<RecurringSchedule, Long> {

    // ✅ OPTIMIZED: Join fetch student
    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.active = true")
    List<RecurringSchedule> findByStudentIdAndActiveTrue(@Param("studentId") Long studentId);

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId")
    List<RecurringSchedule> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.active = true " +
            "ORDER BY rs.createdAt DESC")
    Optional<RecurringSchedule> findByStudentIdAndActiveTrueOrderByCreatedAtDesc(@Param("studentId") Long studentId);

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.active = true " +
            "ORDER BY rs.createdAt DESC")
    List<RecurringSchedule> findByActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "ORDER BY rs.createdAt DESC")
    List<RecurringSchedule> findAllByOrderByCreatedAtDesc();

    // Check existence - không cần join
    boolean existsByStudentIdAndActiveTrue(Long studentId);

    // ✅ Already optimized
    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.id = :id")
    Optional<RecurringSchedule> findByIdWithStudent(@Param("id") Long id);

    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.active = true")
    List<RecurringSchedule> findAllActiveWithStudent();
}