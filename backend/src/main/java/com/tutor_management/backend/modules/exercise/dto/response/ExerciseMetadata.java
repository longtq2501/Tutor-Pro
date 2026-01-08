package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Metadata extracted from import text
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
