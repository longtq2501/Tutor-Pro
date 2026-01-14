package com.tutor_management.backend.modules.feedback.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Result of the Smart Feedback Generation process.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateCommentResponse {
    /**
     * The assembled narrative text in Vietnamese.
     */
    private String generatedComment;

    /**
     * List of scenario IDs used to build this comment (for tracking/debugging).
     */
    private List<Long> usedScenarioIds;
}
