package com.tutor_management.backend.modules.course.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.student.entity.Student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tracks a specific student's progress and notes for an individual lesson.
 */
@Entity
@Table(name = "lesson_progress", uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_lesson", columnNames = { "student_id", "lesson_id" })
}, indexes = {
        @Index(name = "idx_lp_student_id", columnList = "student_id"),
        @Index(name = "idx_lp_lesson_id", columnList = "lesson_id"),
        @Index(name = "idx_lp_completed", columnList = "student_id, is_completed")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The student whose progress is being tracked.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * The lesson being tracked for progress.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    /**
     * Mark as true when the student achieves the learning objective of the lesson.
     */
    @Column(name = "is_completed")
    @Builder.Default
    private Boolean isCompleted = false;

    /**
     * Completion timestamp, manually set or automatically when isCompleted is toggled.
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * Personal study notes or tutor feedback related to this lesson.
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
