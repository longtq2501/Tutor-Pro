package com.tutor_management.backend.modules.finance;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.tutor_management.backend.modules.student.Student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "session_records", indexes = {
        @Index(name = "idx_session_student_id", columnList = "student_id"),
        @Index(name = "idx_session_month", columnList = "month"),
        @Index(name = "idx_session_student_month", columnList = "student_id, month"),
        @Index(name = "idx_session_date", columnList = "sessionDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String month; // Format: YYYY-MM

    @Column(nullable = false)
    private Integer sessions;

    @Column(nullable = false)
    private Double hours;

    @Column(nullable = false)
    private Long pricePerHour;

    @Column(nullable = false)
    private Long totalAmount;

    @Column(nullable = false)
    private Boolean paid;

    private LocalDateTime paidAt;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private LocalDate sessionDate; // Ngày dạy cụ thể

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean completed = false; // Trạng thái đã dạy hay chưa (deprecated, use status instead)

    // ========== NEW FIELDS FOR CALENDAR OPTIMIZATION ==========

    @Column(name = "start_time")
    private LocalTime startTime; // Giờ bắt đầu buổi học (e.g., 14:00)

    @Column(name = "end_time")
    private LocalTime endTime; // Giờ kết thúc buổi học (e.g., 15:30)

    @Column(length = 100)
    private String subject; // Môn học (e.g., Toán 10, Lý 11)

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private LessonStatus status = LessonStatus.SCHEDULED; // Trạng thái chi tiết

    @Builder.Default
    @Version
    private Integer version = 0; // Optimistic locking to prevent concurrent updates

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (paid == null) {
            paid = false;
        }
        if (completed == null) {
            completed = false;
        }
        if (status == null) {
            status = LessonStatus.SCHEDULED;
        }
        if (version == null) {
            version = 0;
        }
    }
}
