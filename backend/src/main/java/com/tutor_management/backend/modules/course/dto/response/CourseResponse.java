package com.tutor_management.backend.modules.course.dto.response;

import com.tutor_management.backend.modules.course.Course;
import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Summary representation of a course for catalog and search views.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedHours;
    private Boolean isPublished;
    private String tutorName;
    private Integer lessonCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Maps a Course entity to a summary response for list views.
     */
    public static CourseResponse fromEntity(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .difficultyLevel(course.getDifficultyLevel())
                .estimatedHours(course.getEstimatedHours())
                .isPublished(course.getIsPublished())
                .tutorName(course.getTutor() != null ? course.getTutor().getFullName() : "Unknown")
                .lessonCount(course.getCourseLessons() != null ? course.getCourseLessons().size() : 0)
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
