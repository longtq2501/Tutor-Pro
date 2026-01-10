package com.tutor_management.backend.modules.exercise.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Read-only representation of an MCQ choice.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OptionResponse {
    
    private String id;
    private String label;
    private String optionText;
    
    /**
     * Truth status. Note: Hidden from students until after submission in some modes.
     */
    private Boolean isCorrect;
}
