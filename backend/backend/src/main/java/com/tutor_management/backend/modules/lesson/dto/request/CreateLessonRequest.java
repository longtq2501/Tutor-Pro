package com.tutor_management.backend.modules.lesson.dto.request;

import com.tutor_management.backend.modules.lesson.dto.response.LessonImageDTO;
import com.tutor_management.backend.modules.lesson.dto.response.LessonResourceDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateLessonRequest {
    private List<Long> studentIds;

    @NotBlank(message = "Tên giáo viên không được để trống")
    private String tutorName;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String summary;

    private String content;

    @NotNull(message = "Ngày dạy không được để trống")
    private LocalDate lessonDate;

    private String videoUrl;

    private String thumbnailUrl;

    private List<LessonImageDTO> images;

    private List<LessonResourceDTO> resources;

    private Boolean isPublished;
}
