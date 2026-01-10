package com.tutor_management.backend.modules.feedback;

import java.time.LocalDateTime;

import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.student.Student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Domain entity representing a tutor's evaluation of a student's performance during a specific session.
 * Contains both quantitative ratings and qualitative generated comments.
 */
@Entity
@Table(name = "session_feedbacks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The specific teaching session being evaluated.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_record_id", nullable = false)
    private SessionRecord sessionRecord;

    /**
     * The student recipient of the feedback.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * Summary of material covered (e.g., "4 kĩ năng tiếng anh và Ngữ Pháp").
     */
    @Column(name = "lesson_content", columnDefinition = "TEXT")
    private String lessonContent;

    /**
     * Qualitative rating for behavior/engagement (e.g., "Xuất Sắc").
     */
    @Column(name = "attitude_rating")
    private String attitudeRating;

    /**
     * Narrative comment describing the student's attitude.
     */
    @Column(name = "attitude_comment", columnDefinition = "TEXT")
    private String attitudeComment;

    /**
     * Qualitative rating for comprehension/focus level.
     */
    @Column(name = "absorption_rating")
    private String absorptionRating;

    /**
     * Narrative comment describing learning progress.
     */
    @Column(name = "absorption_comment", columnDefinition = "TEXT")
    private String absorptionComment;

    /**
     * Specific topics or skills that require further review.
     */
    @Column(name = "knowledge_gaps", columnDefinition = "TEXT")
    private String knowledgeGaps;

    /**
     * Recommended actions or homework for improvement.
     */
    @Column(name = "solutions", columnDefinition = "TEXT")
    private String solutions;

    /**
     * Lifecycle state of this feedback report.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FeedbackStatus status;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        
        if (lessonContent == null) {
            lessonContent = "4 kĩ năng tiếng anh và Ngữ Pháp và Ôn Tập";
        }
        if (status == null) {
            status = FeedbackStatus.DRAFT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
