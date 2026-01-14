package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.LessonCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data response for lesson category details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonCategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String icon;
    private Integer displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Maps entity to response DTO.
     */
    public static LessonCategoryResponse fromEntity(LessonCategory category) {
        if (category == null) return null;
        return LessonCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .icon(category.getIcon())
                .displayOrder(category.getDisplayOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
