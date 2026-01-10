package com.tutor_management.backend.modules.exercise.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Specific choice declaration for Multiple Choice Questions (MCQ).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionRequest {
    
    /**
     * Selection key (e.g., 'A', 'B', 'C', 'D').
     */
    @NotBlank(message = "Nhãn lựa chọn không được để trống")
    @Pattern(regexp = "[A-D]", message = "Nhãn lựa chọn phải là A, B, C, hoặc D")
    private String label;
    
    /**
     * Display text for the choice.
     */
    @NotBlank(message = "Nội dung lựa chọn không được để trống")
    private String optionText;
}
