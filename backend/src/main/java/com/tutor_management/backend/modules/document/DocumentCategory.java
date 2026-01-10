package com.tutor_management.backend.modules.document;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity for classifying documents into logical groups (e.g., Grammar, Exercises).
 * Supports rich UI metadata like colors and icons.
 */
@Entity
@Table(name = "document_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique identifier code used for internal logic or mapping (e.g., "VOCAB").
     */
    @Column(nullable = false, unique = true)
    private String code;

    /**
     * Human-readable display name (e.g., "Vocabulary").
     */
    @Column(nullable = false)
    private String name;

    /**
     * Detailed purpose of the category.
     */
    @Column(length = 500)
    private String description;

    /**
     * Sorting priority for list displays.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    /**
     * Toggle to enable or disable the category in the UI.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /**
     * Hexadecimal color code for UI badging (e.g., "#FF5733").
     */
    @Column(length = 7)
    private String color;

    /**
     * Icon identifier or emoji for graphical representation.
     */
    @Column(length = 50)
    private String icon;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (active == null) active = true;
        if (displayOrder == null) displayOrder = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
