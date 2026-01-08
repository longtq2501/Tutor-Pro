package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseLessonDTO {
    private Long id;
    private Long lessonId;
    private String title;
    private String summary;
    private Integer lessonOrder;
    private Boolean isRequired;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
}
