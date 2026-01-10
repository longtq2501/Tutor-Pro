package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Metadata snapshot extracted from the NLP parser during exercise ingestion.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseMetadata {
    
    private String title;
    private String description;
    private Integer timeLimit;
    private Integer totalPoints;
}
