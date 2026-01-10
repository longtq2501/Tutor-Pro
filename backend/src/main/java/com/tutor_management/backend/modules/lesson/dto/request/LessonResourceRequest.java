package com.tutor_management.backend.modules.lesson.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for attaching a resource to a lesson.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResourceRequest {
    private String title;
    private String description;
    private String resourceUrl;
    
    /**
     * Type of resource (e.g., PDF, LINK, IMAGE, VIDEO, DOCUMENT).
     */
    private String resourceType;
    
    private Long fileSize;
    private Integer displayOrder;
}
