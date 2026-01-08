package com.tutor_management.backend.modules.exercise.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for a single option in MCQ question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionRequest {
    
    /**
     * Option label (A, B, C, or D)
     */
    @NotBlank(message = "Option label is required")
    @Pattern(regexp = "[A-D]", message = "Option label must be A, B, C, or D")
    private String label;
    
    /**
     * The option text
     */
    @NotBlank(message = "Option text is required")
    private String optionText;
}
