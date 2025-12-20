package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Homework;
import com.tutor_management.backend.entity.Homework.HomeworkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {

    // Lấy tất cả homework của một học sinh
    List<Homework> findByStudentIdOrderByDueDateDesc(Long studentId);

    // Lấy homework theo status
    List<Homework> findByStudentIdAndStatusOrderByDueDateDesc(Long studentId, HomeworkStatus status);

    // Lấy homework sắp đến hạn (trong vòng X ngày)
    @Query("SELECT h FROM Homework h WHERE h.student.id = :studentId " +
            "AND h.status IN ('ASSIGNED', 'IN_PROGRESS') " +
            "AND h.dueDate BETWEEN :now AND :endDate " +
            "ORDER BY h.dueDate ASC")
    List<Homework> findUpcomingHomeworks(
            @Param("studentId") Long studentId,
            @Param("now") LocalDateTime now,
            @Param("endDate") LocalDateTime endDate
    );

    // Lấy homework quá hạn
    @Query("SELECT h FROM Homework h WHERE h.student.id = :studentId " +
            "AND h.status = 'OVERDUE' " +
            "ORDER BY h.dueDate DESC")
    List<Homework> findOverdueHomeworks(@Param("studentId") Long studentId);

    // Đếm homework theo status
    Long countByStudentIdAndStatus(Long studentId, HomeworkStatus status);

    // Lấy homework của session cụ thể
    List<Homework> findBySessionRecordIdOrderByCreatedAtDesc(Long sessionRecordId);

    // Thống kê homework
    @Query("SELECT h.status, COUNT(h) FROM Homework h " +
            "WHERE h.student.id = :studentId " +
            "GROUP BY h.status")
    List<Object[]> getHomeworkStatsByStudent(@Param("studentId") Long studentId);

    // Tìm kiếm homework
    @Query("SELECT h FROM Homework h WHERE h.student.id = :studentId " +
            "AND (LOWER(h.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(h.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "ORDER BY h.createdAt DESC")
    List<Homework> searchHomeworks(
            @Param("studentId") Long studentId,
            @Param("keyword") String keyword
    );
}