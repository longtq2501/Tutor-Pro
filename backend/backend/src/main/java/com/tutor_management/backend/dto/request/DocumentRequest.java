package com.tutor_management.backend.dto.request;

import com.tutor_management.backend.entity.DocumentCategory;
import jakarta.validation.constraints.*;
import lombok.*;

// ============= Document Request =============
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private DocumentCategory category;

    private String description;

    private Long studentId; // Optional
}