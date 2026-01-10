package com.tutor_management.backend.modules.lesson.dto.request;

import com.tutor_management.backend.modules.lesson.dto.response.LessonImageDTO;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResourceDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Payload for creating a new {@link com.tutor_management.backend.modules.lesson.Lesson}.
 * Supports both standalone library lessons and lessons with immediate student assignments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    /**
     * Optional list of student IDs to assign this lesson to immediately.
     */
    private List<Long> studentIds;

    @NotBlank(message = "Tên giáo viên không được để trống")
    private String tutorName;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    /**
     * Brief overview of the lesson.
     */
    private String summary;

    /**
     * Full lesson content (Markdown supported).
     */
    private String content;

    @NotNull(message = "Ngày dạy không được để trống")
    private LocalDate lessonDate;

    /**
     * Link to instructional video.
     */
    private String videoUrl;

    /**
     * URL for the lesson cover image.
     */
    private String thumbnailUrl;

    /**
     * Nested image assets for the gallery.
     */
    private List<LessonImageDTO> images;

    /**
     * Nested downloadable or linkable resources.
     */
    private List<LessonResourceDTO> resources;

    /**
     * Whether the lesson should be visible in the library.
     */
    @Builder.Default
    private Boolean isPublished = false;

    /**
     * ID of the associated {@link com.tutor_management.backend.modules.lesson.LessonCategory}.
     */
    private Long categoryId;

    /**
     * Advanced settings for grading and behavior.
     */
    @Builder.Default
    private Boolean allowLateSubmission = true;
    
    @Builder.Default
    private Double latePenaltyPercent = 0.0;
    
    @Builder.Default
    private Integer points = 100;
    
    @Builder.Default
    private Integer passScore = 50;
    
    @Builder.Default
    private String difficultyLevel = "All Levels";
    
    @Builder.Default
    private Integer durationMinutes = 0;
}
