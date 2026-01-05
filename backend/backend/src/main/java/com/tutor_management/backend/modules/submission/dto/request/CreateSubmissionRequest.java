package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for creating a submission
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmissionRequest {
    
    @NotBlank(message = "Exercise ID is required")
    private String exerciseId;
    
    @NotNull(message = "Answers are required")
    @Valid
    private List<AnswerRequest> answers;
}
