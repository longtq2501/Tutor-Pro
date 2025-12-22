package com.tutor_management.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResourceRequest {
    private String title;
    private String description;
    private String resourceUrl;
    private String resourceType;  // PDF, LINK, IMAGE, VIDEO, DOCUMENT
    private Long fileSize;
    private Integer displayOrder;
}