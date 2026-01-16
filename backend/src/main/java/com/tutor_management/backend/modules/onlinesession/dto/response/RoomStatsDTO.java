package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing statistical data for online sessions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomStatsDTO {

    /**
     * Total number of online sessions.
     */
    private Long totalSessions;

    /**
     * Number of currently active sessions.
     */
    private Long activeSessions;

    /**
     * Total billable duration across all sessions in minutes.
     */
    private Long totalDurationMinutes;
}
