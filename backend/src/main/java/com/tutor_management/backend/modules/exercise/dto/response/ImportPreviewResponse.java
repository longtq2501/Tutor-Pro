package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Verification payload presented to users after the AI finishes parsing raw exercise text.
 * Allows the tutor to confirm data accuracy before finalizing the import.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportPreviewResponse {
    
    /**
     * General exercise settings identified by the parser.
     */
    private ExerciseMetadata metadata;
    
    /**
     * Structured question items identified by the parser.
     */
    @Builder.Default
    private List<QuestionPreview> questions = new ArrayList<>();
    
    /**
     * Critical errors that prevent saving (e.g., missing correct answers).
     */
    @Builder.Default
    private List<String> validationErrors = new ArrayList<>();
    
    /**
     * Determines if the preview data satisfies all core business rules.
     */
    @Builder.Default
    private Boolean isValid = true;
}
