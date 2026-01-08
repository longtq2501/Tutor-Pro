package com.tutor_management.backend.modules.feedback;

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

    @Column(name = "category")
    private String category; // "ATTITUDE", "ABSORPTION", "GAPS", "SOLUTIONS"

    @Column(name = "rating_level")
    private String ratingLevel; // "GOOD", "BAD", "AVERAGE"

    @Column(name = "keyword")
    private String keyword; // e.g., "sleepy", "homework", "grammar"

    // Template with placeholders
    // e.g., "{Student} có vẻ {state} hôm nay. Con cần {action} để cải thiện."
    @Column(name = "template_text", columnDefinition = "TEXT")
    private String templateText;

    @Column(name = "variation_group")
    private Integer variationGroup; // To group different wordings of same meaning
}
