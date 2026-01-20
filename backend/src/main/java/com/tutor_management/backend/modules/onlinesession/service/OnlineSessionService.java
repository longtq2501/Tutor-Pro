package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.GlobalStatsResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.JoinRoomResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.RoomStatsResponse;

/**
 * Service interface for managing online live teaching sessions.
 */
public interface OnlineSessionService {

    /**
     * Creates a new online session and publishes a notification event.
     * 
     * @param request The session creation details.
     * @param userId The ID of the user performing the action (for tutorId resolution).
     * @return The created session details.
     */
    OnlineSessionResponse createSession(CreateOnlineSessionRequest request, Long userId);

    /**
     * Joins an existing online session, generating a JWT token for the participant.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user requesting to join.
     * @return Join details including token and TURN configs.
     */
    JoinRoomResponse joinRoom(String roomId, Long userId);

    /**
     * Retrieves statistics for a specific room.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user requesting stats.
     * @return Statistics for the specific room.
     */
    RoomStatsResponse getRoomStats(String roomId, Long userId);

    /**
     * Get global statistics for all online sessions.
     * 
     * @return GlobalStatsResponse containing aggregated data.
     */
    GlobalStatsResponse getGlobalStats();

    /**
     * Ends an online session.
, calculates duration, and publishes a notification event.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user requesting to end the session.
     * @return The updated session details.
     */
    OnlineSessionResponse endSession(String roomId, Long userId);

    /**
     * Updates the last activity timestamp for a room.
     * Called periodically via WebSocket heartbeat.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user sending the heartbeat.
     */
    void updateHeartbeat(String roomId, Long userId);

    /**
     * Finds the most relevant active/upcoming session for the current user.
     * 
     * @param userId The ID of the authenticated user.
     * @return The active session details, or null if none found.
     */
    OnlineSessionResponse getCurrentSession(Long userId);

    /**
     * Updates recording metadata for a specific session.
     * 
     * @param roomId The unique room identifier.
     * @param request The recording metadata details.
     * @return The updated session details.
     */
    OnlineSessionResponse updateRecordingMetadata(String roomId, com.tutor_management.backend.modules.onlinesession.dto.request.UpdateRecordingMetadataRequest request);

    /**
     * Detects and handles inactive participants in active rooms.
     * Should be called periodically by a scheduler.
     */
    void detectInactiveParticipants();
}
