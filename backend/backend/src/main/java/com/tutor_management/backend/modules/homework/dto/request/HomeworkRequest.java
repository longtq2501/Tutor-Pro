package com.tutor_management.backend.modules.homework.dto.request;

import com.tutor_management.backend.modules.homework.Homework.HomeworkPriority;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private Long sessionRecordId; // Optional

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Due date is required")
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;

    private HomeworkPriority priority;

    @Size(max = 2000, message = "Tutor notes must not exceed 2000 characters")
    private String tutorNotes;

    private List<String> attachmentUrls; // Cloudinary URLs
}
