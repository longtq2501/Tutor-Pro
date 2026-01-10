package com.tutor_management.backend.modules.course;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a study course managed by a tutor.
 * A course acts as a container for lessons and can be assigned to multiple students.
 */
@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The tutor who created and owns this course.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_id", nullable = false)
    private User tutor;

    /**
     * The display title of the course.
     */
    @Column(nullable = false, length = 500)
    private String title;

    /**
     * A detailed description of the course content and objectives.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * URL for the course's thumbnail image.
     */
    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    /**
     * The intended difficulty level for this course.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.BEGINNER;

    /**
     * Total estimated hours to complete the course.
     */
    @Column(name = "estimated_hours")
    private Integer estimatedHours;

    /**
     * Whether the course is visible to students.
     */
    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    /**
     * Ordered list of lessons belonging to this course.
     */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("lessonOrder ASC")
    @Builder.Default
    private List<CourseLesson> courseLessons = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
