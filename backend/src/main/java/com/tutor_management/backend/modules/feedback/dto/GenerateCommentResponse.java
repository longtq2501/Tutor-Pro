package com.tutor_management.backend.modules.feedback.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GenerateCommentResponse {
    private String generatedComment;
    private List<Long> usedScenarioIds;
}
