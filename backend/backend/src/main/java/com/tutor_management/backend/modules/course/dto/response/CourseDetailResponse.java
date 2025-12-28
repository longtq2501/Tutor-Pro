package com.tutor_management.backend.modules.course.dto.response;

import com.tutor_management.backend.modules.course.Course;
import com.tutor_management.backend.modules.course.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDetailResponse {
    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private DifficultyLevel difficultyLevel;
    private Integer estimatedHours;
    private Boolean isPublished;
    private String tutorName;
    private List<CourseLessonDTO> lessons;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CourseDetailResponse fromEntity(Course course) {
        return CourseDetailResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .difficultyLevel(course.getDifficultyLevel())
                .estimatedHours(course.getEstimatedHours())
                .isPublished(course.getIsPublished())
                .tutorName(course.getTutor() != null ? course.getTutor().getFullName() : "Unknown")
                .lessons(course.getCourseLessons().stream()
                        .map(cl -> CourseLessonDTO.builder()
                                .id(cl.getId())
                                .lessonId(cl.getLesson().getId())
                                .title(cl.getLesson().getTitle())
                                .summary(cl.getLesson().getSummary())
                                .lessonOrder(cl.getLessonOrder())
                                .isRequired(cl.getIsRequired())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
