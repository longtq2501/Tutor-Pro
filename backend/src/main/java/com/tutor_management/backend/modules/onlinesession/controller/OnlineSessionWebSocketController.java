package com.tutor_management.backend.modules.onlinesession.controller;

import com.tutor_management.backend.modules.onlinesession.service.OnlineSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

/**
 * WebSocket controller for handling real-time messages within online sessions.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class OnlineSessionWebSocketController {

    private final OnlineSessionService onlineSessionService;

    /**
     * Handles heartbeat messages from clients to keep the session alive and detect disconnects.
     * Expects messages to be sent to /app/room/{roomId}/heartbeat
     * 
     * @param roomId The unique room identifier.
     * @param principal The authenticated user's principal.
     */
    @MessageMapping("/room/{roomId}/heartbeat")
    public void handleHeartbeat(@DestinationVariable String roomId, Principal principal) {
        if (principal == null) {
            log.warn("Heartbeat received without authentication for room: {}", roomId);
            return;
        }

        try {
            // ✅ FIX: extract userId from Principal.getName() 
            // set by WebSocketAuthInterceptor during CONNECT
            Long userId = Long.parseLong(principal.getName());
            onlineSessionService.updateHeartbeat(roomId, userId);
        } catch (NumberFormatException e) {
            log.error("Invalid userId in principal name: {}", principal.getName());
        } catch (Exception e) {
            log.error("Error processing heartbeat for room {}: {}", roomId, e.getMessage());
        }
    }
}
