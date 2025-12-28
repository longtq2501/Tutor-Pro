package com.tutor_management.backend.modules.lesson.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonCategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    private String description;
    private String color;
    private String icon;
    private Integer displayOrder;
}
