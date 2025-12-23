package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Lesson;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AdminLessonResponse for Library/Management View
 *
 * This response shows lesson from ADMIN perspective:
 * - No specific student data
 * - Shows assignment statistics (how many students, completion rate, etc.)
 * - Shows library status
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    // ✅ NEW: Assignment statistics
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;

    // Media
    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Create admin response from lesson entity
     * Includes aggregated statistics from all assignments
     */
    public static AdminLessonResponse fromEntity(Lesson lesson) {
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
                // ✅ Assignment statistics
                .assignedStudentCount(lesson.getAssignedStudentCount())
                .totalViewCount(lesson.getTotalViewCount())
                .completionRate(lesson.getCompletionRate())
                // Media
                .images(lesson.getImages().stream()
                        .map(LessonImageDTO::fromEntity)
                        .collect(Collectors.toList()))
                .resources(lesson.getResources().stream()
                        .map(LessonResourceDTO::fromEntity)
                        .collect(Collectors.toList()))
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}