package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for grading essay questions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeSubmissionRequest {
    
    @NotNull(message = "Essay grades are required")
    @Valid
    private List<EssayGradeRequest> essayGrades;
    
    private String teacherComment;
}
