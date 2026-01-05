package com.tutor_management.backend.modules.exercise.dto.request;

import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Request DTO for creating or updating an exercise
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateExerciseRequest {
    
    /**
     * Exercise title
     */
    @NotBlank(message = "Title is required")
    @Size(max = 500, message = "Title must not exceed 500 characters")
    private String title;
    
    /**
     * Exercise description
     */
    private String description;
    
    /**
     * Time limit in minutes
     */
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;
    
    /**
     * Total points
     */
    @NotNull(message = "Total points is required")
    @Min(value = 1, message = "Total points must be at least 1")
    private Integer totalPoints;
    
    /**
     * Deadline for submission
     */
    private LocalDateTime deadline;
    
    /**
     * Class ID
     */
    private String classId;
    
    /**
     * Exercise status
     */
    private ExerciseStatus status;
    
    /**
     * List of questions
     */
    @NotNull(message = "Questions list is required")
    @Size(min = 1, message = "At least one question is required")
    @Valid
    private List<QuestionRequest> questions;
}
