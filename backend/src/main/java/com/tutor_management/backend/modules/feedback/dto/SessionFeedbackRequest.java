package com.tutor_management.backend.modules.feedback.dto;

import com.tutor_management.backend.modules.feedback.FeedbackStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for creating or updating a session feedback report.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedbackRequest {
    
    @NotNull(message = "ID buổi học không được để trống")
    private Long sessionRecordId;

    @NotNull(message = "ID học sinh không được để trống")
    private Long studentId;

    /**
     * Descriptive content of the lesson material.
     */
    private String lessonContent;

    /**
     * Qualitative rating for attitude.
     */
    @NotBlank(message = "Đánh giá thái độ không được để trống")
    private String attitudeRating;

    /**
     * Narrative comment for attitude.
     */
    private String attitudeComment;

    /**
     * Qualitative rating for absorption.
     */
    @NotBlank(message = "Đánh giá tiếp thu không được để trống")
    private String absorptionRating;

    /**
     * Narrative comment for absorption.
     */
    private String absorptionComment;

    /**
     * Identification of knowledge gaps.
     */
    private String knowledgeGaps;

    /**
     * Proposed solutions or homework.
     */
    private String solutions;

    /**
     * Target lifecycle status (DRAFT or SUBMITTED).
     */
    private FeedbackStatus status;
}
