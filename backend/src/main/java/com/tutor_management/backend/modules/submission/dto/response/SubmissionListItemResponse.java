package com.tutor_management.backend.modules.submission.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tutor_management.backend.modules.submission.domain.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * List item response DTO for submission (summary view)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubmissionListItemResponse {
    
    private String id;
    private String studentId;
    private String studentName; // Will be populated from User service
    private SubmissionStatus status;
    private Integer mcqScore;
    private Integer essayScore;
    private Integer totalScore;
    private LocalDateTime submittedAt;
    private LocalDateTime gradedAt;
}
