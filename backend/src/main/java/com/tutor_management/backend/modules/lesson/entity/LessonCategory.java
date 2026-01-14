package com.tutor_management.backend.modules.lesson.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Organizational category for grouping lessons (e.g., "Grammar", "Mathematics").
 * Allows for visual identification via colors and icons in the UI.
 */
@Entity
@Table(name = "lesson_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LessonCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique display name for the category.
     */
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    /**
     * Optional description of the subject matter covered by this category.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Hexadecimal color code (e.g., "#FF5733") used for UI highlights.
     */
    @Column(length = 7)
    private String color;

    /**
     * Name of the CSS or Lucide icon class for the category.
     */
    @Column(length = 50)
    private String icon;

    /**
     * Sorting priority in lists.
     */
    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
