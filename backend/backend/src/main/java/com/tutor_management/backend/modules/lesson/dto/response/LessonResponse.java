package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.Lesson;
import com.tutor_management.backend.modules.lesson.LessonAssignment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
        private LessonCategoryResponse category;

        // Timestamps
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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
                                // Student-specific data from assignment
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

        @Deprecated
        public static LessonResponse fromEntity(Lesson lesson) {
                throw new UnsupportedOperationException(
                                "LessonResponse.fromEntity(Lesson) is deprecated. " +
                                                "Use LessonResponse.fromEntity(Lesson, LessonAssignment) instead to get student-specific data.");
        }
}
