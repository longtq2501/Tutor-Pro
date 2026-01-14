package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.Lesson;
import lombok.*;
import org.hibernate.Hibernate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data response for Administrative lesson management.
 * Includes aggregate statistics and sensitive status flags.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminLessonResponse {
    
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;
    private String videoUrl;
    private String thumbnailUrl;

    private Boolean isPublished;
    private Boolean isLibrary;
    private LocalDateTime publishedAt;
    private Long categoryId;
    private Boolean allowLateSubmission;
    private Double averageRating;
    private Integer reviewCount;
    private Double latePenaltyPercent;
    private Integer points;
    private Integer passScore;
    private Integer totalFeedbacks;
    private Integer totalEnrollments;
    private String difficultyLevel;
    private Integer durationMinutes;

    // Aggregate stats
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;

    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;
    private LessonCategoryResponse category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Maps lesson entity to admin-facing response.
     * Safely handles lazy-loaded collections.
     */
    public static AdminLessonResponse fromEntity(Lesson lesson) {
        int assignedCount = 0;
        int totalViews = 0;
        double completionRate = 0.0;

        if (Hibernate.isInitialized(lesson.getAssignments()) && lesson.getAssignments() != null) {
            assignedCount = lesson.getAssignedStudentCount();
            totalViews = lesson.getTotalViewCount();
            completionRate = lesson.getCompletionRate();
        }

        List<LessonImageDTO> images = new ArrayList<>();
        if (Hibernate.isInitialized(lesson.getImages()) && lesson.getImages() != null) {
            images = lesson.getImages().stream().map(LessonImageDTO::fromEntity).toList();
        }

        List<LessonResourceDTO> resources = new ArrayList<>();
        if (Hibernate.isInitialized(lesson.getResources()) && lesson.getResources() != null) {
            resources = lesson.getResources().stream().map(LessonResourceDTO::fromEntity).toList();
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
                .allowLateSubmission(lesson.getAllowLateSubmission())
                .averageRating(lesson.getAverageRating())
                .reviewCount(lesson.getReviewCount())
                .latePenaltyPercent(lesson.getLatePenaltyPercent())
                .points(lesson.getPoints())
                .passScore(lesson.getPassScore())
                .totalFeedbacks(lesson.getTotalFeedbacks())
                .totalEnrollments(lesson.getTotalEnrollments())
                .difficultyLevel(lesson.getDifficultyLevel())
                .durationMinutes(lesson.getDurationMinutes())
                .assignedStudentCount(assignedCount)
                .totalViewCount(totalViews)
                .completionRate(completionRate)
                .images(images)
                .resources(resources)
                .category(LessonCategoryResponse.fromEntity(lesson.getCategory()))
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}
