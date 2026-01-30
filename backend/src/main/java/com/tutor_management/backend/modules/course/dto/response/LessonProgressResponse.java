package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Response DTO for lesson progress details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonProgressResponse {
    private Long lessonId;
    private String lessonTitle;
    private Integer videoProgress;
    private String learningStatus;
    private String learningStatusColor;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Boolean canUnlockNext;
    private LocalDateTime lastProgressUpdate;
    private Integer viewCount;
    private LocalDateTime lastViewedAt;
}
