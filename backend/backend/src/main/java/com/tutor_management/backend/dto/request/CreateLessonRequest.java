package com.tutor_management.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateLessonRequest {

    @NotEmpty(message = "Phải chọn ít nhất một học sinh")
    private List<Long> studentIds;  // Multi-student assignment

    private String tutorName;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String summary;

    private String content;  // Markdown content

    @NotNull(message = "Ngày dạy không được để trống")
    private LocalDate lessonDate;

    private String videoUrl;
    private String thumbnailUrl;

    // Multiple images
    private List<LessonImageRequest> images;

    // Multiple resources
    private List<LessonResourceRequest> resources;

    private Boolean isPublished;  // Draft vs Published
}