package com.tutor_management.backend.modules.exercise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for importing exercise from text format
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportExerciseRequest {
    
    /**
     * The text content to parse
     */
    @NotBlank(message = "Content cannot be blank")
    private String content;
    
    /**
     * Class ID to associate with the exercise
     */
    private String classId;
}
