package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Global statistics across all online sessions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatsResponse {
    private Long totalSessions;
    private Long activeSessions;
    private Long waitingSessions;
    private Long endedSessions;
    
    private Long totalDurationMinutes;
    private Long sessionsToday;
    
    private Double averageSessionDuration;
}
