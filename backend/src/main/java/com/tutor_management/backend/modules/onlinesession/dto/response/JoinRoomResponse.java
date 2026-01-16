package com.tutor_management.backend.modules.onlinesession.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Response DTO for joining an online room.
 * Contains the access token, session details, and TURN server configuration.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomResponse {

    /**
     * JWT token for authenticating with the signaling server.
     */
    private String token;

    /**
     * Details of the session being joined.
     */
    private OnlineSessionResponse session;

    /**
     * List of TURN/STUN server configurations for WebRTC.
     */
    private List<Map<String, Object>> turnServers;
}
