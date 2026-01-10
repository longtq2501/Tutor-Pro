package com.tutor_management.backend.modules.lesson.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for attaching an image to a lesson.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonImageRequest {
    private String imageUrl;
    private String caption;
    private Integer displayOrder;
}
