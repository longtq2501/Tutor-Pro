package com.tutor_management.backend.modules.submission.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload for creating a new student {@link com.tutor_management.backend.modules.submission.entity.Submission}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubmissionRequest {
    
    @NotBlank(message = "ID bài tập không được để trống")
    private String exerciseId;
    
    @NotNull(message = "Danh sách câu trả lời không được để trống")
    @Valid
    private List<AnswerRequest> answers;
}
