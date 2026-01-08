package com.tutor_management.backend.modules.exercise.dto.request;

import com.tutor_management.backend.modules.exercise.domain.QuestionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for a single question
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    
    /**
     * Type of question (MCQ or ESSAY)
     */
    @NotNull(message = "Question type is required")
    private QuestionType type;
    
    /**
     * The question text
     */
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    /**
     * Points for this question
     */
    @NotNull(message = "Points is required")
    @Min(value = 1, message = "Points must be at least 1")
    private Integer points;
    
    /**
     * Order index for sorting
     */
    @NotNull(message = "Order index is required")
    @Min(value = 0, message = "Order index must be non-negative")
    private Integer orderIndex;
    
    /**
     * Options for MCQ questions (nullable for essay)
     */
    private List<OptionRequest> options;
    
    /**
     * Correct answer for MCQ (A, B, C, D) - nullable for essay
     */
    private String correctAnswer;
    
    /**
     * Rubric for essay questions (nullable for MCQ)
     */
    private String rubric;
}
