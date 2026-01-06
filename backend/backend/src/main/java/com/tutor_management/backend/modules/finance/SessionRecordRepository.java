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

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
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

        @Query("SELECT new com.tutor_management.backend.modules.finance.dto.response.MonthlyStats(" +
                        "sr.month, " +
                        "SUM(CASE WHEN sr.paid = true " +
                        "AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) "
                        +
                        "THEN sr.totalAmount ELSE 0L END), " +
                        "SUM(CASE WHEN sr.paid = false " +
                        "AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) "
                        +
                        "THEN sr.totalAmount ELSE 0L END), " +
                        "CAST(SUM(CASE WHEN sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) "
                        +
                        "THEN sr.sessions ELSE 0 END) AS integer)) " +
                        "FROM SessionRecord sr " +
                        "GROUP BY sr.month " +
                        "ORDER BY sr.month DESC")
        List<MonthlyStats> findAllMonthlyStatsAggregated();

        @Query("SELECT new com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats(" +
                        "CAST(COUNT(DISTINCT sr.student.id) AS integer), " + // totalStudents
                        "SUM(CASE WHEN sr.paid = true AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) THEN sr.totalAmount ELSE 0L END), "
                        + // totalPaidAllTime
                        "SUM(CASE WHEN sr.paid = false AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) THEN sr.totalAmount ELSE 0L END), "
                        + // totalUnpaidAllTime
                        "SUM(CASE WHEN sr.month = :currentMonth AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) THEN sr.totalAmount ELSE 0L END), "
                        + // currentMonthTotal
                        "SUM(CASE WHEN sr.month = :currentMonth AND sr.paid = false AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) THEN sr.totalAmount ELSE 0L END)) "
                        + // currentMonthUnpaid
                        "FROM SessionRecord sr")
        DashboardStats getFinanceSummary(@Param("currentMonth") String currentMonth);

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

        // ✅ OPTIMIZED: Get all sessions for a month (for invoice generation)
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.month = :month " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByMonth(@Param("month") String month);

        // ✅ OPTIMIZED: Get sessions for specific students in a month (for multi-student
        // invoice)
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.month = :month AND sr.student.id IN :studentIds " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByMonthAndStudentIdIn(
                        @Param("month") String month,
                        @Param("studentIds") List<Long> studentIds);

        // ✅ OPTIMIZED: Batch load session records for multiple students
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.student.id IN :studentIds " +
                        "ORDER BY sr.createdAt DESC")
        List<SessionRecord> findByStudentIdIn(@Param("studentIds") List<Long> studentIds);

        // ✅ OPTIMIZED: Find by Student ID and Month (For Student Dashboard)
        @Query("SELECT sr FROM SessionRecord sr " +
                        "WHERE sr.student.id = :studentId AND sr.month = :month " +
                        "ORDER BY sr.sessionDate DESC")
        List<SessionRecord> findByStudentIdAndMonth(@Param("studentId") Long studentId, @Param("month") String month);

        // ✅ OPTIMIZED: For Student List (Filtered & Sorted ASC)
        @Query("SELECT DISTINCT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student s " +
                        "LEFT JOIN FETCH sr.documents " +
                        "LEFT JOIN FETCH sr.lessons " +
                        "WHERE s = :student AND sr.month = :month " +
                        "AND sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR) "
                        +
                        "ORDER BY sr.sessionDate ASC")
        List<SessionRecord> findByStudentAndMonthFilteredOrderByDateAsc(
                        @Param("student") Student student,
                        @Param("month") String month);

        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "LEFT JOIN FETCH sr.documents " +
                        "LEFT JOIN FETCH sr.lessons " +
                        "WHERE sr.id = :id")
        java.util.Optional<SessionRecord> findByIdWithAttachments(@Param("id") Long id);

        // ✅ OPTIMIZED: Find multiple by IDs with student (for invoice batch)
        @Query("SELECT sr FROM SessionRecord sr " +
                        "LEFT JOIN FETCH sr.student " +
                        "WHERE sr.id IN :ids")
        List<SessionRecord> findAllByIdWithStudent(@Param("ids") List<Long> ids);
}
