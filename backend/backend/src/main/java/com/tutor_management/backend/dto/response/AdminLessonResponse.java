package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Lesson;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
     *
     * ⚠️ IMPORTANT: Handles lazy-loaded collections safely
     */
    public static AdminLessonResponse fromEntity(Lesson lesson) {
        // ✅ Safe computation of stats (handles null/uninitialized collections)
        int assignedCount = 0;
        int totalViews = 0;
        double completionRate = 0.0;

        try {
            // Try to get stats from entity helper methods
            assignedCount = lesson.getAssignedStudentCount();
            totalViews = lesson.getTotalViewCount();
            completionRate = lesson.getCompletionRate();
        } catch (Exception e) {
            // If lazy-load fails, use safe defaults
            log.warn("Could not load assignment stats for lesson {}: {}", lesson.getId(), e.getMessage());
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

                // ✅ Use safely computed stats
                .assignedStudentCount(assignedCount)
                .totalViewCount(totalViews)
                .completionRate(completionRate)

                // ✅ Safe image/resource handling
                .images(lesson.getImages() != null && !lesson.getImages().isEmpty()
                        ? lesson.getImages().stream()
                        .map(LessonImageDTO::fromEntity)
                        .collect(Collectors.toList())
                        : new ArrayList<>())
                .resources(lesson.getResources() != null && !lesson.getResources().isEmpty()
                        ? lesson.getResources().stream()
                        .map(LessonResourceDTO::fromEntity)
                        .collect(Collectors.toList())
                        : new ArrayList<>())

                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}