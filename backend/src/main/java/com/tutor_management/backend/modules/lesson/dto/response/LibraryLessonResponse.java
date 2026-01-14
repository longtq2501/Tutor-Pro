package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Optimized response for global lesson library browsing.
 * Excludes heavy content fields to improve listing performance.
 */
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
    
    // Summary statistics
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;
    
    private LessonCategoryResponse category;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Maps lesson entity to library-facing response.
     * Safely handles lazy collections.
     */
    public static LibraryLessonResponse fromEntity(Lesson lesson) {
        int assignedCount = 0;
        int totalViews = 0;
        double completionRate = 0.0;

        if (Hibernate.isInitialized(lesson.getAssignments()) && lesson.getAssignments() != null) {
            assignedCount = lesson.getAssignedStudentCount();
            totalViews = lesson.getTotalViewCount();
            completionRate = lesson.getCompletionRate();
        }

        return LibraryLessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .lessonDate(lesson.getLessonDate())
                .thumbnailUrl(lesson.getThumbnailUrl())
                .isPublished(lesson.getIsPublished())
                .isLibrary(lesson.getIsLibrary())
                .categoryId(lesson.getCategory() != null ? lesson.getCategory().getId() : null)
                .assignedStudentCount(assignedCount)
                .totalViewCount(totalViews)
                .completionRate(completionRate)
                .category(LessonCategoryResponse.fromEntity(lesson.getCategory()))
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
