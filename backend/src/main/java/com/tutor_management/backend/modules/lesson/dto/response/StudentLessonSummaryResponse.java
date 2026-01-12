package com.tutor_management.backend.modules.lesson.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lightweight DTO for lesson listing in student-facing views.
 * Excludes heavy content and assets to optimize backend heap usage.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentLessonSummaryResponse {
    private Long id;
    private String title;
    private String tutorName;
    private String summary;
    private LocalDate lessonDate;
    private String thumbnailUrl;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Integer viewCount;
    private LessonCategoryResponse category;
    private LocalDateTime createdAt;
}
