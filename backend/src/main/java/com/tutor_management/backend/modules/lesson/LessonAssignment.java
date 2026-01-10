package com.tutor_management.backend.modules.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tutor_management.backend.modules.student.Student;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Join entity representing the assignment of a {@link Lesson} to a specific {@link Student}.
 * Tracks individual student progress, completion status, and viewing metrics.
 */
@Entity
@Table(name = "lesson_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"lesson_id", "student_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"lesson", "student"})
public class LessonAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnore
    private Lesson lesson;

    /**
     * The student targeted by this assignment.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * Date when the lesson was officially tasked to the student.
     */
    @Column(name = "assigned_date", nullable = false)
    private LocalDate assignedDate;

    /**
     * Email of the staff member who initiated this assignment.
     */
    @Column(name = "assigned_by")
    private String assignedBy;

    /**
     * Indicates if the student has finished the lesson content.
     */
    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    /**
     * When the student marked the lesson as completed.
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Total number of times the student has accessed the lesson details.
     */
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;

    /**
     * Most recent access timestamp.
     */
    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Progression Logic ---

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
