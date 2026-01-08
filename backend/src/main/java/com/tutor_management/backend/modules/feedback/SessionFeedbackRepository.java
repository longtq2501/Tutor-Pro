package com.tutor_management.backend.modules.feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, Long> {

    @EntityGraph(attributePaths = {"sessionRecord", "student"})
    Optional<SessionFeedback> findFirstBySessionRecordIdAndStudentIdOrderByUpdatedAtDesc(Long sessionRecordId,
            Long studentId);

    List<SessionFeedback> findBySessionRecordId(Long sessionRecordId);

    @EntityGraph(attributePaths = {"sessionRecord", "student"})
    Page<SessionFeedback> findByStudentId(Long studentId, Pageable pageable);

    @EntityGraph(attributePaths = {"sessionRecord", "student"})
    @Query("SELECT sf FROM SessionFeedback sf WHERE sf.student.id = :studentId ORDER BY sf.createdAt DESC")
    List<SessionFeedback> findLatestByStudent(@Param("studentId") Long studentId, Pageable pageable);
}
