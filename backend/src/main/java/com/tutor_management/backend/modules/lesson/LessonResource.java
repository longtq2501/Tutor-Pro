package com.tutor_management.backend.modules.lesson;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * External or internal resource attached to a {@link Lesson} (e.g., PDF, Link, Video).
 */
@Entity
@Table(name = "lesson_resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "lesson")
public class LessonResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    /**
     * Name or label for the resource.
     */
    @Column(nullable = false, length = 500)
    private String title;

    /**
     * Optional explanation of how to use this resource.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Destination link or internal download path.
     */
    @Column(nullable = false, length = 1000)
    private String resourceUrl;

    /**
     * Functional type of the resource for categorization.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResourceType resourceType;

    /**
     * File size in bytes (if applicable).
     */
    private Long fileSize;

    /**
     * Index for sorting resources.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * Supported file and link types.
     */
    public enum ResourceType {
        PDF, LINK, IMAGE, VIDEO, DOCUMENT
    }

    /**
     * Human-readable file size calculation.
     */
    public String getFormattedFileSize() {
        if (fileSize == null || fileSize <= 0) return "N/A";
        if (fileSize < 1024) return fileSize + " B";
        if (fileSize < 1024 * 1024) return String.format("%.1f KB", fileSize / 1024.0);
        return String.format("%.1f MB", fileSize / (1024.0 * 1024.0));
    }
}
