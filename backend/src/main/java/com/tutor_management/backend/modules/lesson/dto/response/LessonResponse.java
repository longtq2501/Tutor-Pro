package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.Lesson;
import com.tutor_management.backend.modules.lesson.entity.LessonAssignment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Data response for Student-facing lesson views.
 * Combines core lesson data with student-specific progress metrics.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;
    private String videoUrl;
    private String thumbnailUrl;
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

    // Progression data
    private Long studentId;
    private String studentName;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Integer viewCount;
    private LocalDateTime lastViewedAt;

    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;
    private LessonCategoryResponse category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Maps lesson and assignment entities to a student-specific response.
     */
    /**
     * Maps lesson and assignment entities to a student-specific response.
     * Handles cases where assignment doesn't exist (viewing via SessionRecord).
     */
    public static LessonResponse fromEntity(Lesson lesson, LessonAssignment assignment) {
        LessonResponseBuilder builder = LessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .content(lesson.getContent())
                .lessonDate(lesson.getLessonDate())
                .videoUrl(lesson.getVideoUrl())
                .thumbnailUrl(lesson.getThumbnailUrl())
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
                .images(lesson.getImages().stream().map(LessonImageDTO::fromEntity).collect(Collectors.toList()))
                .resources(lesson.getResources().stream().map(LessonResourceDTO::fromEntity).collect(Collectors.toList()))
                .category(lesson.getCategory() != null ? LessonCategoryResponse.fromEntity(lesson.getCategory()) : null)
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt());

        if (assignment != null) {
            builder.studentId(assignment.getStudent().getId())
                   .studentName(assignment.getStudent().getName())
                   .isCompleted(assignment.getIsCompleted())
                   .completedAt(assignment.getCompletedAt())
                   .viewCount(assignment.getViewCount())
                   .lastViewedAt(assignment.getLastViewedAt());
        } else {
            // Default values for access via SessionRecord (no formal assignment)
            builder.isCompleted(false)
                   .viewCount(0);
        }
        
        return builder.build();
    }
}
