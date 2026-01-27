package com.tutor_management.backend.modules.feedback.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for the Smart Feedback Generator.
 * Provides the context needed to assemble localized Vietnamese feedback fragments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateCommentRequest {
    /**
     * Diagnostic group (e.g., "ATTITUDE", "ABSORPTION", "GAPS", "SOLUTIONS").
     */
    private String category;

    /**
     * Performance level (e.g., "XUAT_SAC", "GIOI", "KHA", "TRUNG_BINH", "TE").
     */
    private String ratingLevel;

    /**
     * List of thematic tags to trigger specific scenarios (e.g., ["HOMEWORK", "ACTIVE"]).
     */
    private List<String> keywords;

    /**
     * Name of the student to inject into the template placeholders.
     */
    private String studentName;

    /**
     * Subject being taught (e.g., "MATH", "ENGLISH").
     */
    private String subject;

    /**
     * Targeted language for the output (e.g., "vi", "en").
     */
    private String language;

    /**
     * Tone of the feedback (e.g., "PROFESSIONAL", "FRIENDLY", "FORMAL").
     */
    private String tone;

    /**
     * Desire length of the comment (e.g., "SHORT", "MEDIUM", "LONG").
     */
    private String length;

    /**
     * If true, bypass cache and generate a new variation.
     */
    private boolean forceRefresh;
}
