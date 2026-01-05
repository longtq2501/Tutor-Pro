package com.tutor_management.backend.modules.submission.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for a submission
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionResponse {
    
    private String id;
    private String exerciseId;
    private String studentId;
    private String studentName;
    private SubmissionStatus status;
    private Integer mcqScore;
    private Integer essayScore;
    private Integer totalScore;
    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;
    private String teacherComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StudentAnswerResponse> answers;
}
