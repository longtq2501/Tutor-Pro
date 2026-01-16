package com.tutor_management.backend.modules.onlinesession.service;

import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.OnlineSessionResponse;

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
     * Ends an online session, calculates duration, and publishes a notification event.
     * 
     * @param roomId The unique room identifier.
     * @param userId The ID of the user requesting to end the session.
     * @return The updated session details.
     */
    OnlineSessionResponse endSession(String roomId, Long userId);
}
