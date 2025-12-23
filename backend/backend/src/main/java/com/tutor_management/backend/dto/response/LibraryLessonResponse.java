package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryLessonResponse {
    private Long id;
    private String tutorName;
    private String title;
    private String summary;
    private LocalDate lessonDate;
    private String thumbnailUrl;
    private Boolean isPublished;
    private Boolean isLibrary;
    private Integer assignedStudentCount;
    private Integer totalViewCount;
    private Double completionRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LibraryLessonResponse fromEntity(Lesson lesson) {
        return LibraryLessonResponse.builder()
                .id(lesson.getId())
                .tutorName(lesson.getTutorName())
                .title(lesson.getTitle())
                .summary(lesson.getSummary())
                .lessonDate(lesson.getLessonDate())
                .thumbnailUrl(lesson.getThumbnailUrl())
                .isPublished(lesson.getIsPublished())
                .isLibrary(lesson.getIsLibrary())
                .assignedStudentCount(lesson.getAssignedStudentCount())
                .totalViewCount(lesson.getTotalViewCount())
                .completionRate(lesson.getCompletionRate())
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .build();
    }
}