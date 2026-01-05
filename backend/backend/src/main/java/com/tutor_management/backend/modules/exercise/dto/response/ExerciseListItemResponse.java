package com.tutor_management.backend.modules.exercise.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * List item response DTO for exercise (summary view)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExerciseListItemResponse {
    
    private String id;
    private String title;
    private String description;
    private Integer totalPoints;
    private Integer timeLimit; // Added timeLimit
    private LocalDateTime deadline; // Added deadline
    private LocalDateTime createdAt;
    private ExerciseStatus status;
    private Integer questionCount;
    private Integer submissionCount;
    
    // Student specific submission info
    private String submissionId;
    private String submissionStatus;
    private Integer studentTotalScore;
}
