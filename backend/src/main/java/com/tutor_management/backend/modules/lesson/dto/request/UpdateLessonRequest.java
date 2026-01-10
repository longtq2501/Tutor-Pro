package com.tutor_management.backend.modules.lesson.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Payload for updating an existing {@link com.tutor_management.backend.modules.lesson.Lesson}.
 * Only non-null fields will be updated in the entity.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateLessonRequest {
    private String tutorName;
    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;
    private String videoUrl;
    private String thumbnailUrl;
    private List<LessonImageRequest> images;
    private List<LessonResourceRequest> resources;
    private Boolean isPublished;
    
    // Additional settings
    private Long categoryId;
    private Boolean allowLateSubmission;
    private Double latePenaltyPercent;
    private Integer points;
    private Integer passScore;
    private String difficultyLevel;
    private Integer durationMinutes;
}
