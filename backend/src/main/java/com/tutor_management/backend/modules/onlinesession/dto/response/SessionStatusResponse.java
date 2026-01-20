package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionStatusResponse {
    public enum Type {
        PARTICIPANT_JOINED,
        PARTICIPANT_LEFT,
        INACTIVITY_WARNING,
        ROOM_AUTO_ENDED
    }

    private String roomId;
    private Type type;
    private Long userId; // For joined/left
    private String role; // For joined/left
    private Integer remainingSeconds; // For inactivity warning
    private String message;
}
