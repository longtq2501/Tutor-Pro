package com.tutor_management.backend.modules.lesson;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = { "assignments", "images", "resources" })
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== BASIC INFO =====
    @Column(nullable = false, length = 255)
    private String tutorName;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT")
    private String content; // Markdown content

    @Column(nullable = false)
    private LocalDate lessonDate;

    // ===== MEDIA URLs =====
    @Column(length = 1000)
    private String videoUrl;

    @Column(length = 1000)
    private String thumbnailUrl;

    // ===== LIBRARY FEATURE =====
    @Column(name = "is_library", nullable = false)
    @Builder.Default
    private Boolean isLibrary = true;

    // ===== PUBLISH STATUS =====
    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private Boolean isPublished = false; // Draft vs Published

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    // ===== CATEGORY =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private LessonCategory category;

    // ===== RELATIONSHIPS =====
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<LessonAssignment> assignments = new HashSet<>();

    /**
     * Images associated with this lesson
     */
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Fetch(FetchMode.SUBSELECT)
    @Builder.Default
    private List<LessonImage> images = new ArrayList<>();

    /**
     * Resources (PDFs, links, etc.) associated with this lesson
     */
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Fetch(FetchMode.SUBSELECT)
    @Builder.Default
    private List<LessonResource> resources = new ArrayList<>();

    // ===== TIMESTAMPS =====
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ===== HELPER METHODS =====

    /**
     * Publish this lesson (make it visible in library)
     */
    public void publish() {
        this.isPublished = true;
        this.publishedAt = LocalDateTime.now();
    }

    /**
     * Unpublish this lesson (hide from library)
     */
    public void unpublish() {
        this.isPublished = false;
        this.publishedAt = null;
    }

    /**
     * Mark as library lesson (not assigned yet)
     */
    public void markAsLibrary() {
        this.isLibrary = true;
    }

    /**
     * Mark as assigned (has at least one student)
     */
    public void markAsAssigned() {
        this.isLibrary = false;
    }

    /**
     * Get total number of students assigned to this lesson
     */
    public int getAssignedStudentCount() {
        return assignments != null ? assignments.size() : 0;
    }

    /**
     * Get total view count across all students
     */
    @JsonIgnore
    public int getTotalViewCount() {
        return assignments != null
                ? assignments.stream().mapToInt(LessonAssignment::getViewCount).sum()
                : 0;
    }

    /**
     * Get completion rate across all assigned students
     */
    public double getCompletionRate() {
        if (assignments == null || assignments.isEmpty()) {
            return 0.0;
        }
        long completedCount = assignments.stream()
                .filter(LessonAssignment::getIsCompleted)
                .count();
        return (completedCount * 100.0) / assignments.size();
    }
}
