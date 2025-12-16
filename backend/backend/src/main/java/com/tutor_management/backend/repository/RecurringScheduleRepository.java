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

    // Lấy lịch theo student
    List<RecurringSchedule> findByStudentIdAndActiveTrue(Long studentId);

    List<RecurringSchedule> findByStudentId(Long studentId);

    // Lấy lịch active theo student
    Optional<RecurringSchedule> findByStudentIdAndActiveTrueOrderByCreatedAtDesc(Long studentId);

    // Lấy tất cả lịch active
    List<RecurringSchedule> findByActiveTrueOrderByCreatedAtDesc();

    // Lấy tất cả lịch (bao gồm inactive)
    List<RecurringSchedule> findAllByOrderByCreatedAtDesc();

    // Check student đã có lịch active chưa
    boolean existsByStudentIdAndActiveTrue(Long studentId);

    // Lấy lịch với thông tin student
    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.id = :id")
    Optional<RecurringSchedule> findByIdWithStudent(@Param("id") Long id);

    // Lấy tất cả lịch active với thông tin student
    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.active = true")
    List<RecurringSchedule> findAllActiveWithStudent();
}