package com.tutor_management.backend.modules.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data response object for {@link com.tutor_management.backend.modules.schedule.RecurringSchedule} details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringScheduleResponse {
    
    private Long id;
    private Long studentId;
    private String studentName;
    
    /**
     * Raw day integers (1-7).
     */
    private Integer[] daysOfWeek;
    
    /**
     * Localized display string (e.g., "Thứ 2, Thứ 4, Thứ 6").
     */
    private String daysOfWeekDisplay;
    
    private String startTime;
    private String endTime;
    
    /**
     * Formatted range string (e.g., "18:00-20:00").
     */
    private String timeRange;
    
    private Double hoursPerSession;
    private String startMonth;
    private String endMonth;
    private Boolean active;
    private String notes;
    private String subject;

    private String createdAt;
    private String updatedAt;
}
