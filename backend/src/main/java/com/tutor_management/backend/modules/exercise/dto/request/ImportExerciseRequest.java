package com.tutor_management.backend.modules.exercise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for importing an exercise template from a raw text block (AI-powered ingestion).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportExerciseRequest {
    
    /**
     * The raw text content to be parsed by the NLP engine.
     */
    @NotBlank(message = "Nội dung nhập không được để trống")
    private String content;
    
    /**
     * UUID of the class category for the imported resource.
     */
    private String classId;
}
