package com.tutor_management.backend.modules.exercise.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignExerciseRequest {
    private String studentId;
    private LocalDateTime deadline;
}
