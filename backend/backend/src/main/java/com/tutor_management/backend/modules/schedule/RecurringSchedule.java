package com.tutor_management.backend.modules.schedule;

import com.tutor_management.backend.modules.student.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "recurring_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecurringSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * Các ngày trong tuần học (1-7: Monday-Sunday)
     * Stored as comma-separated string: "1,3,5" = Thứ 2, 4, 6
     */
    @Column(nullable = false, length = 20)
    private String daysOfWeek;

    /**
     * Giờ bắt đầu học
     */
    @Column(nullable = false)
    private LocalTime startTime;

    /**
     * Giờ kết thúc học
     */
    @Column(nullable = false)
    private LocalTime endTime;

    /**
     * Số giờ mỗi buổi học
     */
    @Column(nullable = false)
    private Double hoursPerSession;

    /**
     * Tháng bắt đầu áp dụng lịch (YYYY-MM)
     */
    @Column(nullable = false, length = 7)
    private String startMonth;

    /**
     * Tháng kết thúc lịch (optional)
     * Null = không có ngày kết thúc
     */
    @Column(length = 7)
    private String endMonth;

    /**
     * Lịch có active không
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public Integer[] getDaysOfWeekArray() {
        if (daysOfWeek == null || daysOfWeek.isEmpty()) {
            return new Integer[0];
        }
        String[] parts = daysOfWeek.split(",");
        Integer[] days = new Integer[parts.length];
        for (int i = 0; i < parts.length; i++) {
            days[i] = Integer.parseInt(parts[i].trim());
        }
        return days;
    }

    public void setDaysOfWeekArray(Integer[] days) {
        if (days == null || days.length == 0) {
            this.daysOfWeek = "";
            return;
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < days.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(days[i]);
        }
        this.daysOfWeek = sb.toString();
    }
}
