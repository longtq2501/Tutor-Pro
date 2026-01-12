package com.tutor_management.backend.modules.lesson.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lightweight DTO for lesson listing in administrative views.
 * Excludes heavy content and nested collections to optimize memory.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminLessonSummaryResponse {
    private Long id;
    private String title;
    private String tutorName;
    private LocalDate lessonDate;
    private Boolean isPublished;
    private Boolean isLibrary;
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;
    private String categoryName;
    private LocalDateTime createdAt;
}
