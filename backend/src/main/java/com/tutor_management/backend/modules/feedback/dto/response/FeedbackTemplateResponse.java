package com.tutor_management.backend.modules.feedback.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackTemplateResponse {
    private Long id;
    private String title;
    private String content;
    private String category;
    private boolean isSystem;
    private boolean isOwner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
