package com.tutor_management.backend.modules.homework;

import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.student.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "homeworks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Homework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_record_id")
    private SessionRecord sessionRecord; // Bài tập thuộc buổi học nào

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime dueDate; // Hạn nộp

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HomeworkStatus status; // ASSIGNED, IN_PROGRESS, SUBMITTED, GRADED, OVERDUE

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HomeworkPriority priority; // LOW, MEDIUM, HIGH

    @Column(length = 1000)
    private String attachmentUrls; // URLs từ Cloudinary, phân cách bởi dấu phẩy

    @Column(length = 2000)
    private String tutorNotes; // Ghi chú của gia sư khi giao bài

    // Submission info
    private LocalDateTime submittedAt;

    @Column(length = 1000)
    private String submissionUrls; // File học sinh nộp

    @Column(length = 2000)
    private String submissionNotes; // Ghi chú của học sinh khi nộp

    // Grading info
    private Integer score; // Điểm số (0-100)

    @Column(length = 2000)
    private String feedback; // Nhận xét của gia sư

    private LocalDateTime gradedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = HomeworkStatus.ASSIGNED;
        }
        if (priority == null) {
            priority = HomeworkPriority.MEDIUM;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();

        // Auto update status to OVERDUE if past due date and not submitted
        if (dueDate != null && LocalDateTime.now().isAfter(dueDate)
                && status == HomeworkStatus.ASSIGNED) {
            status = HomeworkStatus.OVERDUE;
        }
    }

    // Enums
    public enum HomeworkStatus {
        ASSIGNED,      // Đã giao
        IN_PROGRESS,   // Đang làm
        SUBMITTED,     // Đã nộp
        GRADED,        // Đã chấm
        OVERDUE        // Quá hạn
    }

    public enum HomeworkPriority {
        LOW,
        MEDIUM,
        HIGH
    }
}
