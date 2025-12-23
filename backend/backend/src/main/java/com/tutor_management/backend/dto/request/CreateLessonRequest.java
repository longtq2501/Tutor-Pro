package com.tutor_management.backend.dto.request;

import com.tutor_management.backend.dto.response.LessonImageDTO;
import com.tutor_management.backend.dto.response.LessonResourceDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreateLessonRequest {

    // ✅ REMOVE @NotEmpty - Make optional for library lessons
    // @NotEmpty(message = "Phải chọn ít nhất một học sinh")
    private List<Long> studentIds;  // ✅ Optional now

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