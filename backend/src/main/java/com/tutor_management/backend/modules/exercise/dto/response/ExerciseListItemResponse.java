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
    private Integer timeLimit;
    private LocalDateTime deadline;
    private ExerciseStatus status;
    private Integer questionCount;
    private Integer submissionCount;
    private LocalDateTime createdAt;
    
    // Student specific submission info
    private String submissionId;
    private String submissionStatus;
    private Integer studentTotalScore;

    /**
     * Constructor for JPQL mapping in ExerciseRepository
     */
    public ExerciseListItemResponse(
            String id, String title, String description, Integer totalPoints,
            Integer timeLimit, LocalDateTime deadline, ExerciseStatus status,
            Integer questionCount, Integer submissionCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.totalPoints = totalPoints;
        this.timeLimit = timeLimit;
        this.deadline = deadline;
        this.status = status;
        this.questionCount = questionCount;
        this.submissionCount = submissionCount;
        this.createdAt = createdAt;
    }
}
