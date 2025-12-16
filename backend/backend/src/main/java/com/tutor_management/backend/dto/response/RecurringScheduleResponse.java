package com.tutor_management.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecurringScheduleResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Integer[] daysOfWeek;
    private String daysOfWeekDisplay; // "Thứ 2, 4, 6"
    private String startTime;
    private String endTime;
    private String timeRange; // "18:00-20:00"
    private Double hoursPerSession;
    private String startMonth;
    private String endMonth;
    private Boolean active;
    private String notes;
    private String createdAt;
    private String updatedAt;
}