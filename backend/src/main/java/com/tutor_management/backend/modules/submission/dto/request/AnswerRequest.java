package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for a single answer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    
    @NotBlank(message = "Question ID is required")
    private String questionId;
    
    /**
     * Selected option for MCQ (A, B, C, D)
     */
    private String selectedOption;
    
    /**
     * Essay text for essay questions
     */
    private String essayText;
}
