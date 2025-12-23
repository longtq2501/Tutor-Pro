package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Lesson;
import com.tutor_management.backend.entity.LessonAssignment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * LessonResponse for Student View
 *
 * ⚠️ IMPORTANT: This response is FOR A SPECIFIC STUDENT
 * Since Lesson is now Many-to-Many, we need to include:
 * - studentId (the current student viewing)
 * - isCompleted, completedAt, viewCount (from LessonAssignment for this student)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonResponse {
    // Lesson info
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;
    private String videoUrl;
    private String thumbnailUrl;

    // Student-specific info (from LessonAssignment)
    private Long studentId;
    private String studentName;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Integer viewCount;
    private LocalDateTime lastViewedAt;

    // Media
    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * ✅ NEW: Create response from Lesson + LessonAssignment
     * This method REQUIRES the assignment to get student-specific data
     */
    public static LessonResponse fromEntity(Lesson lesson, LessonAssignment assignment) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .content(lesson.getContent())
                .lessonDate(lesson.getLessonDate())
                .videoUrl(lesson.getVideoUrl())
                .thumbnailUrl(lesson.getThumbnailUrl())
                // ✅ Student-specific data from assignment
                .studentId(assignment.getStudent().getId())
                .studentName(assignment.getStudent().getName())
                .isCompleted(assignment.getIsCompleted())
                .completedAt(assignment.getCompletedAt())
                .viewCount(assignment.getViewCount())
                .lastViewedAt(assignment.getLastViewedAt())
                // Media (shared across all students)
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

    /**
     * ⚠️ DEPRECATED: This method won't work anymore because Lesson no longer has direct student reference
     * Use fromEntity(Lesson, LessonAssignment) instead
     */
    @Deprecated
    public static LessonResponse fromEntity(Lesson lesson) {
        throw new UnsupportedOperationException(
                "LessonResponse.fromEntity(Lesson) is deprecated. " +
                        "Use LessonResponse.fromEntity(Lesson, LessonAssignment) instead to get student-specific data."
        );
    }
}