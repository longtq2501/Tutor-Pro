package com.tutor_management.backend.modules.tutor.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TutorStatsDTO {
    private long studentCount;
    private long sessionCount;
    private double totalRevenue;
}
