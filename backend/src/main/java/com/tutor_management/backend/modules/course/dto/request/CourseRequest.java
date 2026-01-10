package com.tutor_management.backend.modules.course.dto.request;

import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * Request payload for creating or updating a course.
 */
@Data
public class CourseRequest {
    /**
     * The title of the course. Must be unique and descriptive.
     */
    @NotBlank(message = "Tiêu đề khóa học không được để trống")
    private String title;

    /**
     * Comprehensive summary of the course content.
     */
    private String description;

    /**
     * URL for the course thumbnail image.
     */
    private String thumbnailUrl;

    /**
     * Expected difficulty for targeting specific student levels.
     */
    private DifficultyLevel difficultyLevel;

    /**
     * Calculated total duration to complete all lessons.
     */
    private Integer estimatedHours;

    /**
     * Toggle to make the course visible for enrollment.
     */
    private Boolean isPublished;

    /**
     * Initial set of lesson IDs to include in the course curriculum.
     */
    private List<Long> lessonIds;
}
