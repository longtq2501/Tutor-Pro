package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO containing detailed information about an online session.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnlineSessionResponse {

    private Long id;
    private String roomId;
    private String roomStatus;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;
    private Long tutorId;
    private String tutorName;
    private Long studentId;
    private String studentName;
    private boolean canJoinNow;
}
