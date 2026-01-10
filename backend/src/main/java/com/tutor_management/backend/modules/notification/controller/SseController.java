package com.tutor_management.backend.modules.notification.controller;

import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.notification.service.SseEmittersManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

/**
 * Controller specifically for SSE (Server-Sent Events) streaming.
 * 
 * Provides the long-lived connection endpoint that browsers subscribe to 
 * for real-time notification push.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class SseController {

    private final SseEmittersManager sseEmittersManager;

    /**
     * Establishes a persistent SSE stream for the authenticated user.
     * 
     * The connection remains open (24h timeout) to allow the backend to push 
     * notifications immediately as they occur via SseEmittersManager.
     * 
     * @param user The authenticated user to link the stream to
     * @return An active SseEmitter instance
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@AuthenticationPrincipal User user) {
        log.info("New SSE subscription request from User: {}", user.getId());
        
        // Initiate emitter with an extended timeout (24 hours) as per UI requirements
        SseEmitter emitter = new SseEmitter(24 * 60 * 60 * 1000L);
        
        // Register connection for real-time routing
        sseEmittersManager.addEmitter(user.getId(), emitter);

        // Send confirmation 'connected' event to the client
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("SSE connection established successfully"));
            log.debug("Confirmation heartbeat sent to user {}", user.getId());
        } catch (IOException e) {
            log.error("Failed to establish stream for user {}: {}", user.getId(), e.getMessage());
            sseEmittersManager.removeEmitter(user.getId());
        }

        return emitter;
    }
}
