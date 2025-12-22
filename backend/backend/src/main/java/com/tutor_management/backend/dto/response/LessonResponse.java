package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Lesson;
import com.tutor_management.backend.entity.LessonResource;
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
    private Long id;
    private Long studentId;
    private String studentName;
    private String tutorName;

    private String title;
    private String summary;
    private String content;
    private LocalDate lessonDate;

    private String videoUrl;
    private String thumbnailUrl;

    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Integer viewCount;
    private LocalDateTime lastViewedAt;

    private List<LessonImageDTO> images;
    private List<LessonResourceDTO> resources;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LessonResponse fromEntity(Lesson lesson) {
        return LessonResponse.builder()
                .id(lesson.getId())
                .studentId(lesson.getStudent().getId())
                .studentName(lesson.getStudent().getName())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .content(lesson.getContent())
                .lessonDate(lesson.getLessonDate())
                .videoUrl(lesson.getVideoUrl())
                .thumbnailUrl(lesson.getThumbnailUrl())
                .isCompleted(lesson.getIsCompleted())
                .completedAt(lesson.getCompletedAt())
                .viewCount(lesson.getViewCount())
                .lastViewedAt(lesson.getLastViewedAt())
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