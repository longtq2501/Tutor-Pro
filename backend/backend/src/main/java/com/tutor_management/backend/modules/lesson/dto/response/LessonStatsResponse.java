package com.tutor_management.backend.modules.lesson.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonStatsResponse {
    private Long totalLessons;
    private Long completedLessons;
    private Long inProgressLessons;
    private Double completionRate;  // percentage
}
