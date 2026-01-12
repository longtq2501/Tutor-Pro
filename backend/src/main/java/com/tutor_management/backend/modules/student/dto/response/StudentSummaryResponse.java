package com.tutor_management.backend.modules.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight summary of a student record for list views.
 * Reduces memory usage and response payload by excluding detailed histories and notes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentSummaryResponse {
    
    private Long id;
    private String name;
    private String phone;
    private String schedule;
    private Long pricePerHour;
    private Boolean active;
    
    /**
     * Current outstanding tuition balance.
     * Calculated value, not stored directly in the student table.
     */
    private Long totalUnpaid;

    /**
     * Enrollment month (YYYY-MM).
     */
    private String startMonth;

    /**
     * Human-readable duration summary (e.g., "Bắt đầu: 01/2024 • 12 tháng").
     */
    private String learningDuration;
}
