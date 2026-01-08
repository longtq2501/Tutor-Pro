package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for grading a single essay question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EssayGradeRequest {
    
    @NotBlank(message = "Question ID is required")
    private String questionId;
    
    @NotNull(message = "Points is required")
    @Min(value = 0, message = "Points must be non-negative")
    private Integer points;
    
    private String feedback;
}
