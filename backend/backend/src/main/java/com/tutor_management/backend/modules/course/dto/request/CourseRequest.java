package com.tutor_management.backend.modules.course.dto.request;

import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CourseRequest {
    @NotBlank(message = "Tiêu đề khóa học không được để trống")
    private String title;

    private String description;
    private String thumbnailUrl;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedHours;
    private Boolean isPublished;

    // Optional: initial lessons to add by ID
    private List<Long> lessonIds;
}
