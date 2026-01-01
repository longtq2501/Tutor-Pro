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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_record_id", nullable = false)
    private SessionRecord sessionRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // 1. Nội dung bài học (Default: "4 kĩ năng tiếng anh và Ngữ Pháp và Ôn Tập")
    @Column(name = "lesson_content", columnDefinition = "TEXT")
    private String lessonContent;

    // 2. Thái độ học
    @Column(name = "attitude_rating")
    private String attitudeRating; // "Tệ", "Trung Bình", "Khá", "Giỏi", "Xuất Sắc"

    @Column(name = "attitude_comment", columnDefinition = "TEXT")
    private String attitudeComment; // Generated: 2+ sentences

    // 3. Khả năng tập trung/tiếp thu
    @Column(name = "absorption_rating")
    private String absorptionRating; // "Tệ", "Trung Bình", "Khá", "Giỏi", "Xuất Sắc"

    @Column(name = "absorption_comment", columnDefinition = "TEXT")
    private String absorptionComment; // Generated: 2+ sentences

    // 4. Kiến thức chưa nắm vững
    @Column(name = "knowledge_gaps", columnDefinition = "TEXT")
    private String knowledgeGaps;

    // 5. Lý do/giải pháp
    @Column(name = "solutions", columnDefinition = "TEXT")
    private String solutions;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FeedbackStatus status; // DRAFT, SUBMITTED

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
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
