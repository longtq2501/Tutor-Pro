package com.tutor_management.backend.modules.onlinesession.controller;

import com.tutor_management.backend.modules.onlinesession.dto.request.TypingRequest;
import com.tutor_management.backend.modules.onlinesession.dto.response.ChatMessageResponse;
import com.tutor_management.backend.modules.onlinesession.dto.response.TypingResponse;
import com.tutor_management.backend.modules.onlinesession.service.ChatService;
import com.tutor_management.backend.modules.onlinesession.service.OnlineSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

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

    /**
     * Handles incoming chat messages from participants.
     * Persists the message to the database and broadcasts it to all room participants.
     * Expects messages at /app/room/{roomId}/chat
     * 
     * @param roomId The room ID
     * @param request The chat message request
     * @param principal The sender's principal
     */
    @MessageMapping("/room/{roomId}/chat")
    public void handleChatMessage(
            @DestinationVariable String roomId, 
            com.tutor_management.backend.modules.onlinesession.dto.request.ChatMessageRequest request, 
            Principal principal) {
        
        if (principal == null) {
            log.warn("Chat message received without authentication for room: {}", roomId);
            return;
        }

        try {
            Long userId = Long.parseLong(principal.getName());
            ChatMessageResponse response =
                    chatService.saveMessage(roomId, userId, request);
            
            // Broadcast to the room topic
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/chat", response);
            log.debug("Chat message from user {} broadcasted to room {}", userId, roomId);
        } catch (Exception e) {
            log.error("Error processing chat message for room {}: {}", roomId, e.getMessage());
        }
    }

    /**
     * Handles typing status notifications from participants.
     * Broadcasts the "is typing" status to all room participants.
     * 
     * @param roomId The room ID
     * @param request The typing status request
     * @param principal The sender's principal
     */
    @MessageMapping("/room/{roomId}/typing")
    public void handleTypingStatus(
            @DestinationVariable String roomId,
            TypingRequest request,
            Principal principal) {
        
        if (principal == null) return;

        try {
            Long userId = Long.parseLong(principal.getName());
            TypingResponse response =
                    chatService.createTypingResponse(userId, request.isTyping());
            
            messagingTemplate.convertAndSend("/topic/room/" + roomId + "/typing", response);
        } catch (Exception e) {
            log.error("Error processing typing status for room {}: {}", roomId, e.getMessage());
        }
    }
}
