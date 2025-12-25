package com.tutor_management.backend.modules.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tutor_management.backend.modules.student.Student;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"lesson_id", "student_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== RELATIONSHIPS =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // ===== ASSIGNMENT INFO =====
    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    @Column(name = "assigned_by")
    private String assignedBy;  // Email of admin/tutor who assigned

    // ===== STUDENT PROGRESS (per assignment) =====
    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;

    // ===== TIMESTAMPS =====
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ===== HELPER METHODS =====
    public void incrementViewCount() {
        this.viewCount++;
        this.lastViewedAt = LocalDateTime.now();
    }

    public void markAsCompleted() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }

    public void markAsIncomplete() {
        this.isCompleted = false;
        this.completedAt = null;
    }
}
