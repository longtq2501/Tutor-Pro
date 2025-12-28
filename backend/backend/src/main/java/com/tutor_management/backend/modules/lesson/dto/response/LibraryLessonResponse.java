package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class LibraryLessonResponse {
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private LocalDate lessonDate;
    private String thumbnailUrl;
    private Boolean isPublished;
    private Long categoryId;
    private Boolean isLibrary;
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;
    private LessonCategoryResponse category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LibraryLessonResponse fromEntity(Lesson lesson) {
        int assignedCount = 0;
        int totalViews = 0;
        double completionRate = 0.0;

        // Wrap in try-catch to handle any lazy loading issues
        try {
            if (lesson.getAssignments() != null) {
                assignedCount = lesson.getAssignments().size();

                if (assignedCount > 0) {
                    totalViews = lesson.getAssignments().stream()
                            .mapToInt(a -> a.getViewCount() != null ? a.getViewCount() : 0)
                            .sum();

                    long completedCount = lesson.getAssignments().stream()
                            .filter(a -> Boolean.TRUE.equals(a.getIsCompleted()))
                            .count();

                    completionRate = (double) completedCount / assignedCount * 100.0;
                }
            }
        } catch (Exception e) {
            // If lazy loading fails, just use defaults
            log.debug("Could not load assignments for lesson {}, using defaults", lesson.getId());
            assignedCount = 0;
            totalViews = 0;
            completionRate = 0.0;
        }

        return LibraryLessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .lessonDate(lesson.getLessonDate())
                .thumbnailUrl(lesson.getThumbnailUrl())
                .isPublished(Boolean.TRUE.equals(lesson.getIsPublished()))
                .isLibrary(Boolean.TRUE.equals(lesson.getIsLibrary()))
                .categoryId(lesson.getCategory() != null ? lesson.getCategory().getId() : null)
                .assignedStudentCount(assignedCount)
                .totalViewCount(totalViews)
                .completionRate(completionRate)
                .category(lesson.getCategory() != null ? LessonCategoryResponse.builder()
                        .id(lesson.getCategory().getId())
                        .name(lesson.getCategory().getName())
                        .color(lesson.getCategory().getColor())
                        .icon(lesson.getCategory().getIcon())
                        .build() : null)
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
