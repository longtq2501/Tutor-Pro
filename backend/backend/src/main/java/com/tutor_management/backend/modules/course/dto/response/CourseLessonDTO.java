package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonDTO {
    private Long id;
    private Long lessonId;
    private String title;
    private String summary;
    private Integer lessonOrder;
    private Boolean isRequired;
}
