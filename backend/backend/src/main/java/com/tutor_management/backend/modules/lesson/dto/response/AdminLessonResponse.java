package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.Lesson;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class AdminLessonResponse {
    // Lesson basic info
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;
    private String videoUrl;
    private String thumbnailUrl;

    // Publishing status
    private Boolean isPublished;
    private Boolean isLibrary;
    private LocalDateTime publishedAt;
    private Long categoryId;

    // Assignment statistics
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;

    // Media
    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;
    private LessonCategoryResponse category;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminLessonResponse fromEntity(Lesson lesson) {
        int assignedCount = 0;
        int totalViews = 0;
        double completionRate = 0.0;

        // Kiểm tra xem assignments đã được load chưa trước khi dùng helper methods
        if (Hibernate.isInitialized(lesson.getAssignments()) && lesson.getAssignments() != null) {
            assignedCount = lesson.getAssignedStudentCount();
            totalViews = lesson.getTotalViewCount();
            completionRate = lesson.getCompletionRate();
        }

        return AdminLessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .content(lesson.getContent())
                .lessonDate(lesson.getLessonDate())
                .videoUrl(lesson.getVideoUrl())
                .thumbnailUrl(lesson.getThumbnailUrl())
                .isPublished(lesson.getIsPublished())
                .isLibrary(lesson.getIsLibrary())
                .publishedAt(lesson.getPublishedAt())
                .categoryId(lesson.getCategory() != null ? lesson.getCategory().getId() : null)
                .assignedStudentCount(assignedCount)
                .totalViewCount(totalViews)
                .completionRate(completionRate)
                .images(Hibernate.isInitialized(lesson.getImages()) && lesson.getImages() != null
                        ? lesson.getImages().stream().map(LessonImageDTO::fromEntity).toList()
                        : new ArrayList<>())
                .resources(Hibernate.isInitialized(lesson.getResources()) && lesson.getResources() != null
                        ? lesson.getResources().stream().map(LessonResourceDTO::fromEntity).toList()
                        : new ArrayList<>())
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
