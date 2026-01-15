package com.tutor_management.backend.modules.schedule.repository;

import com.tutor_management.backend.modules.schedule.entity.RecurringSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link RecurringSchedule} management.
 * Includes optimized fetching strategies for student data.
 */
@Repository
public interface RecurringScheduleRepository extends JpaRepository<RecurringSchedule, Long> {

    /**
     * Retrieves all active schedules for a student.
     */
    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.active = true")
    List<RecurringSchedule> findByStudentIdAndActiveTrue(@Param("studentId") Long studentId);

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.student.tutorId = :tutorId AND rs.active = true")
    List<RecurringSchedule> findByStudentIdAndTutorIdAndActiveTrue(@Param("studentId") Long studentId, @Param("tutorId") Long tutorId);

    /**
     * Retrieves the most recently created active schedule for a student.
     */
    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.active = true " +
            "ORDER BY rs.createdAt DESC")
    Optional<RecurringSchedule> findByStudentIdAndActiveTrueOrderByCreatedAtDesc(@Param("studentId") Long studentId);

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.id = :studentId AND rs.student.tutorId = :tutorId AND rs.active = true " +
            "ORDER BY rs.createdAt DESC")
    Optional<RecurringSchedule> findByStudentIdAndTutorIdAndActiveTrueOrderByCreatedAtDesc(@Param("studentId") Long studentId, @Param("tutorId") Long tutorId);

    /**
     * Retrieves the complete schedule history ordered by creation date.
     */
    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "ORDER BY rs.createdAt DESC")
    List<RecurringSchedule> findAllByOrderByCreatedAtDesc();

    @Query("SELECT rs FROM RecurringSchedule rs " +
            "JOIN FETCH rs.student " +
            "WHERE rs.student.tutorId = :tutorId " +
            "ORDER BY rs.createdAt DESC")
    List<RecurringSchedule> findAllByTutorIdOrderByCreatedAtDesc(@Param("tutorId") Long tutorId);

    /**
     * Fetches a specific schedule with student data eagerly loaded.
     */
    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.id = :id")
    Optional<RecurringSchedule> findByIdWithStudent(@Param("id") Long id);

    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.id = :id AND rs.student.tutorId = :tutorId")
    Optional<RecurringSchedule> findByIdAndTutorIdWithStudent(@Param("id") Long id, @Param("tutorId") Long tutorId);

    /**
     * Fetches all active schedules across all students.
     */
    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.active = true")
    List<RecurringSchedule> findAllActiveWithStudent();

    @Query("SELECT rs FROM RecurringSchedule rs JOIN FETCH rs.student WHERE rs.active = true AND rs.student.tutorId = :tutorId")
    List<RecurringSchedule> findAllActiveByTutorIdWithStudent(@Param("tutorId") Long tutorId);
}
