package com.tutor_management.backend.modules.schedule.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecurringScheduleRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Days of week is required")
    @Size(min = 1, message = "At least one day must be selected")
    private Integer[] daysOfWeek; // [1,3,5] = Thứ 2,4,6

    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Invalid time format. Use HH:mm")
    private String startTime; // "18:00"

    @NotBlank(message = "End time is required")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Invalid time format. Use HH:mm")
    private String endTime; // "20:00"

    @NotNull(message = "Hours per session is required")
    @DecimalMin(value = "0.5", message = "Hours per session must be at least 0.5")
    private Double hoursPerSession;

    @NotBlank(message = "Start month is required")
    @Pattern(regexp = "\\d{4}-\\d{2}", message = "Start month must be in format YYYY-MM")
    private String startMonth;

    @Pattern(regexp = "\\d{4}-\\d{2}", message = "End month must be in format YYYY-MM")
    private String endMonth; // Optional

    private Boolean active;

    private String notes;

    private String subject;

}
