package com.tutor_management.backend.modules.feedback.dto;

import com.tutor_management.backend.modules.feedback.FeedbackStatus;

import lombok.Data;

@Data
public class SessionFeedbackRequest {
    private Long sessionRecordId;
    private Long studentId;

    private String lessonContent;

    private String attitudeRating;
    private String attitudeComment;

    private String absorptionRating;
    private String absorptionComment;

    private String knowledgeGaps;
    private String solutions;

    private FeedbackStatus status;
}
