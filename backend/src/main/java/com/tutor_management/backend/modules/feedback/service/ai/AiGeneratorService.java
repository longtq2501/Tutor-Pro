package com.tutor_management.backend.modules.feedback.service.ai;

import com.tutor_management.backend.modules.feedback.dto.request.GenerateCommentRequest;

/**
 * Interface for AI-based feedback generation services.
 */
public interface AiGeneratorService {
    /**
     * Generates a natural language comment based on the provided request metadata.
     * 
     * @param request The generation parameters (category, level, keywords, etc.)
     * @return Generated comment or null if generation fails
     */
    String generate(GenerateCommentRequest request);

    /**
     * Checks if the AI service is currently enabled and healthy.
     */
    boolean isEnabled();
}
