package com.tutor_management.backend.dto.response;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonSummaryDTO {
    private Long id;
    private String title;
    private LocalDate lessonDate;
    private String studentName;
    private Boolean isPublished;
    private Boolean isCompleted;
    private Integer viewCount;
}