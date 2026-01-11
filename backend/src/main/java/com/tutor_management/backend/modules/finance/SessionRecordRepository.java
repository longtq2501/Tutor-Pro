package com.tutor_management.backend.modules.finance;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats;
import com.tutor_management.backend.modules.finance.dto.response.MonthlyStats;
import com.tutor_management.backend.modules.student.Student;

/**
 * Data access interface for {@link SessionRecord} entities.
 * Includes complex aggregation queries for financial reporting and dashboard statistics.
 */
@Repository
public interface SessionRecordRepository extends JpaRepository<SessionRecord, Long> {

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.student.id = :studentId " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);

    /**
     * Retrieves all session records for a specific student.
     * Simplified version without ordering - used for cascade deletion and bulk operations.
     */
    List<SessionRecord> findByStudentId(Long studentId);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findAllByOrderByCreatedAtDesc();

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.month = :month " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByMonthOrderByCreatedAtDesc(@Param("month") String month);

    @Query("SELECT DISTINCT sr.month FROM SessionRecord sr ORDER BY sr.month DESC")
    List<String> findDistinctMonths();

    /**
     * Aggregates revenue and session counts grouped by month.
     * Excludes cancelled sessions from financial totals.
     */
    @Query("SELECT new com.tutor_management.backend.modules.finance.dto.response.MonthlyStats(" +
           "sr.month, " +
           "SUM(CASE WHEN sr.paid = true AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END), " +
           "SUM(CASE WHEN sr.paid = false AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END), " +
           "CAST(SUM(CASE WHEN (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.sessions ELSE 0 END) AS integer)) " +
           "FROM SessionRecord sr " +
           "GROUP BY sr.month " +
           "ORDER BY sr.month DESC")
    List<MonthlyStats> findAllMonthlyStatsAggregated();

    /**
     * Calculates global dashboard metrics for the financial module.
     */
    @Query("SELECT new com.tutor_management.backend.modules.dashboard.dto.response.DashboardStats(" +
           "CAST(COUNT(DISTINCT sr.student.id) AS integer), " +
           "SUM(CASE WHEN sr.paid = true AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END), " +
           "SUM(CASE WHEN sr.paid = false AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END), " +
           "SUM(CASE WHEN sr.month = :currentMonth AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END), " +
           "SUM(CASE WHEN sr.month = :currentMonth AND sr.paid = false AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) THEN sr.totalAmount ELSE 0L END)) " +
           "FROM SessionRecord sr")
    DashboardStats getFinanceSummary(@Param("currentMonth") String currentMonth);

    void deleteByMonth(String month);

    @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.paid = true AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR))")
    Long sumTotalPaid();

    @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.paid = false AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR))")
    Long sumTotalUnpaid();

    @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.month = :month AND sr.paid = true AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR))")
    Long sumTotalPaidByMonth(@Param("month") String month);

    @Query("SELECT COALESCE(SUM(sr.totalAmount), 0) FROM SessionRecord sr WHERE sr.month = :month AND sr.paid = false AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR))")
    Long sumTotalUnpaidByMonth(@Param("month") String month);

    @Query("SELECT COALESCE(SUM(sr.sessions), 0) FROM SessionRecord sr WHERE sr.month = :month AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR))")
    Integer sumSessionsByMonth(@Param("month") String month);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.paid = false " +
           "ORDER BY sr.sessionDate DESC")
    List<SessionRecord> findByPaidFalseOrderBySessionDateDesc();

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student s " +
           "WHERE s = :student " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByStudentOrderByCreatedAtDesc(@Param("student") Student student);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student s " +
           "WHERE s = :student AND sr.month = :month " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByStudentAndMonthOrderByCreatedAtDesc(
            @Param("student") Student student,
            @Param("month") String month);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.month = :month " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByMonth(@Param("month") String month);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.month = :month AND sr.student.id IN :studentIds " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByMonthAndStudentIdIn(
            @Param("month") String month,
            @Param("studentIds") List<Long> studentIds);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.student.id IN :studentIds " +
           "ORDER BY sr.createdAt DESC")
    List<SessionRecord> findByStudentIdIn(@Param("studentIds") List<Long> studentIds);

    @Query("SELECT sr FROM SessionRecord sr " +
           "WHERE sr.student.id = :studentId AND sr.month = :month " +
           "ORDER BY sr.sessionDate DESC")
    List<SessionRecord> findByStudentIdAndMonth(@Param("studentId") Long studentId, @Param("month") String month);

    /**
     * Retrieves detailed session records for a specific student and month, 
     * including attached lesson and document metadata.
     */
    @Query("SELECT DISTINCT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student s " +
           "LEFT JOIN FETCH sr.documents " +
           "LEFT JOIN FETCH sr.lessons " +
           "WHERE s = :student AND sr.month = :month " +
           "AND (sr.status IS NULL OR sr.status NOT IN (com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_STUDENT, com.tutor_management.backend.modules.finance.LessonStatus.CANCELLED_BY_TUTOR)) " +
           "ORDER BY sr.sessionDate ASC")
    List<SessionRecord> findByStudentAndMonthFilteredOrderByDateAsc(
            @Param("student") Student student,
            @Param("month") String month);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "LEFT JOIN FETCH sr.documents " +
           "LEFT JOIN FETCH sr.lessons " +
           "WHERE sr.id = :id")
    Optional<SessionRecord> findByIdWithAttachments(@Param("id") Long id);

    @Query("SELECT sr FROM SessionRecord sr " +
           "LEFT JOIN FETCH sr.student " +
           "WHERE sr.id IN :ids")
    List<SessionRecord> findAllByIdWithStudent(@Param("ids") List<Long> ids);

    @Modifying
    @Query(value = "DELETE FROM session_documents WHERE document_id = :documentId", nativeQuery = true)
    void deleteDocumentReferences(@Param("documentId") Long documentId);

    @Modifying
    @Query(value = "DELETE FROM session_lessons WHERE lesson_id = :lessonId", nativeQuery = true)
    void deleteLessonReferences(@Param("lessonId") Long lessonId);
}
