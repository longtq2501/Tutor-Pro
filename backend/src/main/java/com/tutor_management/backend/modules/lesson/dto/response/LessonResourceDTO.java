package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.LessonResource;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResourceDTO {
    private Long id;
    private String title;
    private String description;
    private String resourceUrl;
    private String resourceType;
    private Long fileSize;
    private String formattedFileSize;
    private Integer displayOrder;

    public static LessonResourceDTO fromEntity(LessonResource resource) {
        return LessonResourceDTO.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .resourceUrl(resource.getResourceUrl())
                .resourceType(resource.getResourceType().name())
                .fileSize(resource.getFileSize())
                .formattedFileSize(resource.getFormattedFileSize())
                .displayOrder(resource.getDisplayOrder())
                .build();
    }
}
