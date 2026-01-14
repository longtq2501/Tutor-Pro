package com.tutor_management.backend.modules.schedule.entity;

import com.tutor_management.backend.modules.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Domain entity representing a recurring weekly lesson schedule for a student.
 * Used to define fixed learning slots and automate session record generation.
 */
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

    /**
     * The student to whom this schedule applies.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * Active days of the week for this schedule.
     * Stored as a comma-separated string (1=Monday, 7=Sunday).
     * Example: "1,3,5" represents Mon, Wed, Fri.
     */
    @Column(nullable = false, length = 20)
    private String daysOfWeek;

    /**
     * Start time of the learning session.
     */
    @Column(nullable = false)
    private LocalTime startTime;

    /**
     * End time of the learning session.
     */
    @Column(nullable = false)
    private LocalTime endTime;

    /**
     * Total hours per session, used for billing calculations.
     */
    @Column(nullable = false)
    private Double hoursPerSession;

    /**
     * Month when this schedule becomes active (YYYY-MM).
     */
    @Column(nullable = false, length = 7)
    private String startMonth;

    /**
     * Month when this schedule expires (YYYY-MM). Null for indefinite schedules.
     */
    @Column(length = 7)
    private String endMonth;

    /**
     * Lifecycle status of the schedule record.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Internal notes regarding the schedule configuration.
     */
    @Column(length = 500)
    private String notes;

    /**
     * The subject being taught (e.g., "Toán 12", "IELTS").
     */
    @Column(length = 255)
    private String subject;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Parses the internal comma-separated string into a clean Integer array.
     */
    public Integer[] getDaysOfWeekArray() {
        if (daysOfWeek == null || daysOfWeek.isBlank()) {
            return new Integer[0];
        }
        return Arrays.stream(daysOfWeek.split(","))
                .map(s -> Integer.parseInt(s.trim()))
                .toArray(Integer[]::new);
    }

    /**
     * Serializes an array of day integers into the internal string format.
     */
    public void setDaysOfWeekArray(Integer[] days) {
        if (days == null || days.length == 0) {
            this.daysOfWeek = "";
            return;
        }
        this.daysOfWeek = Arrays.stream(days)
                .map(String::valueOf)
                .collect(Collectors.joining(","));
    }
}
