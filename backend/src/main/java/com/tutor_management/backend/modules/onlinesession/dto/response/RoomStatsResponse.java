package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Statistics for a specific online session room.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomStatsResponse {
    
    // Room identification
    private String roomId;
    private String roomStatus;
    
    // Participants
    private Long tutorId; // User ID of the tutor
    private Long studentId; // User ID of the student (if linked to User)
    private String tutorName;
    private String studentName;
    private Boolean tutorPresent;
    private Boolean studentPresent;
    private Integer participantCount;
    
    // Timing
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;
    private LocalDateTime tutorJoinedAt;
    private LocalDateTime studentJoinedAt;
    
    // Duration
    private Integer durationMinutes;
    private Integer durationSeconds;
    
    // Recording
    private Boolean recordingEnabled;
    private Boolean recordingDownloaded;
    private Integer recordingDurationMinutes;
    private String recordingFileSizeMb;
}
