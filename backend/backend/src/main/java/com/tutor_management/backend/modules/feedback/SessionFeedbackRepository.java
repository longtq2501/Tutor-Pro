package com.tutor_management.backend.modules.feedback;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, Long> {

    Optional<SessionFeedback> findFirstBySessionRecordIdAndStudentIdOrderByUpdatedAtDesc(Long sessionRecordId,
            Long studentId);

    List<SessionFeedback> findBySessionRecordId(Long sessionRecordId);

    Page<SessionFeedback> findByStudentId(Long studentId, Pageable pageable);

    @Query("SELECT sf FROM SessionFeedback sf WHERE sf.student.id = :studentId ORDER BY sf.createdAt DESC")
    List<SessionFeedback> findLatestByStudent(@Param("studentId") Long studentId, Pageable pageable);
}
