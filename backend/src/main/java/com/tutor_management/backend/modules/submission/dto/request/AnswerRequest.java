package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for a single question response within a submission.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    
    @NotBlank(message = "ID câu hỏi không được để trống")
    private String questionId;
    
    /**
     * Selected option (e.g., 'A', 'B') for MCQ items.
     */
    private String selectedOption;
    
    /**
     * Raw text response for essay/open-ended items.
     */
    private String essayText;
}
