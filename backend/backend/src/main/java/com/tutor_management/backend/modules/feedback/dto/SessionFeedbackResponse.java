package com.tutor_management.backend.modules.feedback.dto;

import java.time.LocalDateTime;

import com.tutor_management.backend.modules.feedback.FeedbackStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionFeedbackResponse {
    private Long id;
    private Long sessionRecordId;
    private Long studentId;
    private String studentName;
    private java.time.LocalDate sessionDate;

    private String lessonContent;

    private String attitudeRating;
    private String attitudeComment;

    private String absorptionRating;
    private String absorptionComment;

    private String knowledgeGaps;
    private String solutions;

    private FeedbackStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
