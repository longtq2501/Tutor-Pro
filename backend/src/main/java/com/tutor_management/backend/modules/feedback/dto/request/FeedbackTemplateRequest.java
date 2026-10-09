package com.tutor_management.backend.modules.feedback.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackTemplateRequest {

    @NotBlank(message = "Tiêu đề mẫu câu không được để trống")
    @Size(max = 150, message = "Tiêu đề không quá 150 ký tự")
    private String title;

    @NotBlank(message = "Nội dung nhận xét không được để trống")
    private String content;

    @NotBlank(message = "Danh mục không được để trống")
    private String category;
}
