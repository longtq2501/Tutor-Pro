package com.tutor_management.backend.modules.exercise.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tutor_management.backend.modules.exercise.domain.ExerciseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Full domain object representing a complete exercise resource.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExerciseResponse {
    
    private String id;
    private String title;
    private String description;
    private Integer timeLimit;
    private Integer totalPoints;
    private LocalDateTime deadline;
    private ExerciseStatus status;
    private String classId;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Recursive list containing the full structured content of all questions.
     */
    private List<QuestionResponse> questions;
}
