package com.tutor_management.backend.modules.feedback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a pre-defined feedback fragment used by the Smart Generator.
 * Scenarios allow tutors to build natural-sounding reports by selecting thematic keywords.
 */
@Entity
@Table(name = "feedback_scenarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackScenario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The diagnostic category (e.g., "ATTITUDE", "ABSORPTION", "GAPS", "SOLUTIONS").
     */
    @Column(name = "category", nullable = false)
    private String category;

    /**
     * Performance level associated with this template (e.g., "GOOD", "BAD", "AVERAGE").
     */
    @Column(name = "rating_level", nullable = false)
    private String ratingLevel;

    /**
     * The trigger keyword (e.g., "sleepy", "homework", "grammar").
     * Tutors select these to find appropriate fragments.
     */
    @Column(name = "keyword", nullable = false)
    private String keyword;

    /**
     * The Vietnamese text fragment. 
     * Supports placeholders like {Student} which are replaced during generation.
     */
    @Column(name = "template_text", columnDefinition = "TEXT", nullable = false)
    private String templateText;

    /**
     * Optional grouping for templates with identical meaning but different wording.
     * Prevents the generator from picking redundant phrases.
     */
    @Column(name = "variation_group")
    private Integer variationGroup;
}
