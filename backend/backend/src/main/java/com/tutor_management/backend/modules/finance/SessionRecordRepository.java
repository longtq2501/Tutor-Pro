// =========================================================================
// FILE 2: SessionRecordRepository.java
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.modules.finance;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tutor_management.backend.modules.student.Student;

@Repository
public interface SessionRecordRepository extends JpaRepository<SessionRecord, Long> {

        // ✅ OPTIMIZED: Join fetch student
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.student.id = :studentId " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);

        // ✅ OPTIMIZED: Get all with student
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findAllByOrderByCreatedAtDesc();

        // ✅ OPTIMIZED: By month with student
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.month = :month " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByMonthOrderByCreatedAtDesc(@Param("month") String month);

        // Distinct months - không cần join
        @Query("SELECT DISTINCT sr.month FROM SessionRecord sr ORDER BY sr.month DESC")
        List<String> findDistinctMonths();

        void deleteByMonth(String month);

        // Sum queries - không cần join (chỉ aggregate)
        @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.paid = true AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)")
        Long sumTotalPaid();

        @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.paid = false AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)")
        Long sumTotalUnpaid();

        @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.month = :month AND sr.paid = true AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)")
        Long sumTotalPaidByMonth(@Param("month") String month);

        @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.month = :month AND sr.paid = false AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)")
        Long sumTotalUnpaidByMonth(@Param("month") String month);

        @Query("SELECT COALESCE(SUM(sr.sessions), 0) FROM SessionRecord sr WHERE sr.month = :month AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)")
        Integer sumSessionsByMonth(@Param("month") String month);

        // ✅ OPTIMIZED: Unpaid sessions with student
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.paid = false " +
                        "ORDER BY sr.sessionDate DESC")
        List<SessionRecord> findByPaidFalseOrderBySessionDateDesc();

        // ✅ OPTIMIZED: By student entity
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student s " +
                        "WHERE s = :student " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByStudentOrderByCreatedAtDesc(@Param("student") Student student);

        // ✅ OPTIMIZED: By student and month
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student s " +
                        "WHERE s = :student AND sr.month = :month " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByStudentAndMonthOrderByCreatedAtDesc(
                        @Param("student") Student student,
                        @Param("month") String month);
}
