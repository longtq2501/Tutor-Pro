package com.tutor_management.backend.modules.feedback.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.tutor_management.backend.modules.feedback.FeedbackStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Comprehensive view of a session feedback report.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedbackResponse {
    
    private Long id;
    private Long sessionRecordId;
    private Long studentId;
    private String studentName;
    private LocalDate sessionDate;

    /**
     * What was taught during the session.
     */
    private String lessonContent;

    /**
     * Assessment of behavior.
     */
    private String attitudeRating;
    private String attitudeComment;

    /**
     * Assessment of learning comprehension.
     */
    private String absorptionRating;
    private String absorptionComment;

    /**
     * Areas requiring improvement.
     */
    private String knowledgeGaps;

    /**
     * Recommended actions.
     */
    private String solutions;

    /**
     * Lifecycle state.
     */
    private FeedbackStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
