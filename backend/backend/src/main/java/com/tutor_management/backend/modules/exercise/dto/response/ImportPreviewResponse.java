package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for import preview
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportPreviewResponse {
    
    private ExerciseMetadata metadata;
    
    @Builder.Default
    private List<QuestionPreview> questions = new ArrayList<>();
    
    @Builder.Default
    private List<String> validationErrors = new ArrayList<>();
    
    @Builder.Default
    private Boolean isValid = true;
}
