package com.tutor_management.backend.modules.lesson.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Domain entity representing a learning lesson in the system.
 * Can exist as a standalone library item or be assigned to specific students.
 * Supports rich content via Markdown, video links, images, and downloadable resources.
 */
@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "assignments", "images", "resources", "category" })
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the tutor who authored or handles this lesson.
     */
    @Column(nullable = false, length = 255)
    private String tutorName;

    /**
     * Descriptive title of the lesson.
     */
    @Column(nullable = false, length = 500)
    private String title;

    /**
     * Brief overview or teaser of the lesson content.
     */
    @Column(columnDefinition = "TEXT")
    private String summary;

    /**
     * Full lesson body, typically stored in Markdown format.
     */
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    /**
     * Original creation or scheduled date of the lesson.
     */
    @Column(nullable = false)
    private LocalDate lessonDate;

    /**
     * Link to instructional video (YouTube, Vimeo, etc.).
     */
    @Column(length = 1000)
    private String videoUrl;

    /**
     * Cover image URL for the lesson card.
     */
    @Column(length = 1000)
    private String thumbnailUrl;

    /**
     * Indicates if this lesson is part of the global library available for reuse.
     */
    @Column(name = "is_library", nullable = false)
    @Builder.Default
    private Boolean isLibrary = true;

    /**
     * Visibility status of the lesson.
     */
    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private Boolean isPublished = false;

    /**
     * Timestamp of official publication.
     */
    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    /**
     * Whether students can submit work after the target date.
     */
    @Column(name = "allow_late_submission", nullable = false)
    @Builder.Default
    private Boolean allowLateSubmission = true;

    /**
     * Aggregate student rating.
     */
    @Column(name = "average_rating", nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    /**
     * Total number of reviews received.
     */
    @Column(name = "review_count", nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    /**
     * Grade deduction percentage for late work.
     */
    @Column(name = "late_penalty_percent", nullable = false)
    @Builder.Default
    private Double latePenaltyPercent = 0.0;

    /**
     * Maximum possible points for this lesson.
     */
    @Column(name = "points", nullable = false)
    @Builder.Default
    private Integer points = 100;

    /**
     * Minimum score required for a 'Pass' grade.
     */
    @Column(name = "pass_score", nullable = false)
    @Builder.Default
    private Integer passScore = 50;

    @Column(name = "total_feedbacks", nullable = false)
    @Builder.Default
    private Integer totalFeedbacks = 0;

    @Column(name = "total_enrollments", nullable = false)
    @Builder.Default
    private Integer totalEnrollments = 0;

    @Column(name = "difficulty_level", length = 50)
    @Builder.Default
    private String difficultyLevel = "All Levels";

    @Column(name = "duration_minutes")
    @Builder.Default
    private Integer durationMinutes = 0;

    /**
     * Organizational category for the lesson.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private LessonCategory category;

    /**
     * Student-specific assignments of this lesson.
     */
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<LessonAssignment> assignments = new HashSet<>();

    /**
     * Gallery of images illustrating the lesson.
     */
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Fetch(FetchMode.SUBSELECT)
    @Builder.Default
    private Set<LessonImage> images = new HashSet<>();

    /**
     * Downloadable files or external links relevant to the lesson.
     */
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Fetch(FetchMode.SUBSELECT)
    @Builder.Default
    private Set<LessonResource> resources = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // --- Life cycle methods ---

    public void publish() {
        this.isPublished = true;
        this.publishedAt = LocalDateTime.now();
    }

    public void unpublish() {
        this.isPublished = false;
        this.publishedAt = null;
    }

    public void markAsLibrary() {
        this.isLibrary = true;
    }

    public void markAsAssigned() {
        this.isLibrary = false;
    }

    @JsonIgnore
    public int getAssignedStudentCount() {
        return assignments != null ? assignments.size() : 0;
    }

    @JsonIgnore
    public int getTotalViewCount() {
        return assignments != null
                ? assignments.stream().mapToInt(LessonAssignment::getViewCount).sum()
                : 0;
    }

    @JsonIgnore
    public double getCompletionRate() {
        if (assignments == null || assignments.isEmpty()) return 0.0;
        long completed = assignments.stream().filter(LessonAssignment::getIsCompleted).count();
        return (completed * 100.0) / assignments.size();
    }
}
