package com.tutor_management.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkStatsResponse {
    private Long totalHomeworks;
    private Long assignedCount;
    private Long inProgressCount;
    private Long submittedCount;
    private Long gradedCount;
    private Long overdueCount;
    private Double averageScore;
    private Long upcomingCount; // Due within 7 days
}