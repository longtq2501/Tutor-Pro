package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload for grading a student's submission, specifically focusing on essay items.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeSubmissionRequest {
    
    @NotNull(message = "Danh sách điểm tự luận không được để trống")
    @Valid
    private List<EssayGradeRequest> essayGrades;
    
    /**
     * Global feedback for the entire submission.
     */
    private String teacherComment;
}
