package com.tutor_management.backend.modules.exercise.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Request payload for assigning an existing exercise to a student.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignExerciseRequest {
    /**
     * UUID of the student recipient.
     */
    private String studentId;

    /**
     * Personalized cutoff time. Overrides the template's global deadline if provided.
     */
    private LocalDateTime deadline;
}
