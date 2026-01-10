package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for grading an individual essay response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EssayGradeRequest {
    
    @NotBlank(message = "ID câu hỏi không được để trống")
    private String questionId;
    
    @NotNull(message = "Điểm số không được để trống")
    @Min(value = 0, message = "Điểm số không được nhỏ hơn 0")
    private Integer points;
    
    /**
     * Specific feedback for this specific answer.
     */
    private String feedback;
}
