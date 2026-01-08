package com.tutor_management.backend.modules.homework.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkSubmissionRequest {

    @Size(max = 2000, message = "Submission notes must not exceed 2000 characters")
    private String submissionNotes;

    private List<String> submissionUrls; // File URLs học sinh nộp
}
