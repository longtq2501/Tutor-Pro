package com.tutor_management.backend.modules.course.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.student.entity.Student;
import com.tutor_management.backend.modules.course.enums.LearningStatus;

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

    // ============ NEW FIELDS FOR VIDEO PROGRESS ============
    
    /**
     * Video watch progress percentage (0-100).
     * Tracks how much of the video the student has actually watched.
     */
    @Column(name = "video_progress", nullable = false)
    @Builder.Default
    private Integer videoProgress = 0;
    
    /**
     * Learning status based on video progress.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "learning_status", nullable = false, length = 20)
    @Builder.Default
    private LearningStatus learningStatus = LearningStatus.NOT_STARTED;
    
    /**
     * Timestamp of last progress update.
     */
    @Column(name = "last_progress_update")
    private LocalDateTime lastProgressUpdate;
    
    /**
     * Number of times student has viewed this lesson.
     */
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
    
    /**
     * Most recent view timestamp.
     */
    @Column(name = "last_viewed_at")
    private LocalDateTime lastViewedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // ============ BUSINESS LOGIC METHODS ============
    
    /**
     * Updates video progress and recalculates learning status.
     * Only allows progress to increase (anti-cheat).
     */
    public void updateVideoProgress(int progress) {
        if (progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
        
        // Only update if progress increased
        if (progress > this.videoProgress) {
            this.videoProgress = progress;
            updateLearningStatus();
            this.lastProgressUpdate = LocalDateTime.now();
        }
    }
    
    /**
     * Calculates and updates learning status based on current video progress.
     */
    private void updateLearningStatus() {
        if (videoProgress == 0) {
            this.learningStatus = LearningStatus.NOT_STARTED;
        } else if (videoProgress < 70) {
            this.learningStatus = LearningStatus.IN_PROGRESS;
        } else if (videoProgress < 100) {
            this.learningStatus = LearningStatus.ALMOST_COMPLETE;
        } else {
            this.learningStatus = LearningStatus.COMPLETED;
            // Auto-mark as completed when 100%
            if (Boolean.FALSE.equals(this.isCompleted)) {
                this.isCompleted = true;
                this.completedAt = LocalDateTime.now();
            }
        }
    }
    
    /**
     * Checks if next lesson in course can be unlocked.
     */
    public boolean canUnlockNext() {
        return this.videoProgress >= 70;
    }
    
    /**
     * Increments view count and updates last viewed timestamp.
     */
    public void incrementViewCount() {
        this.viewCount++;
        this.lastViewedAt = LocalDateTime.now();
    }
}
