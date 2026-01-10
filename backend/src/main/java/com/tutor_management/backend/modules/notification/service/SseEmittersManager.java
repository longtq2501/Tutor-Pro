package com.tutor_management.backend.modules.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Component responsible for managing active SSE (Server-Sent Events) connections.
 * 
 * Uses a thread-safe map to track emitters per user ID and handles lifecycle 
 * events like completion, timeouts, and errors.
 */
@Service
@Slf4j
public class SseEmittersManager {

    /** Memory store for active emitters: UserID -> SseEmitter */
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     * Registers a new SSE connection for a user.
     * Configures automatic cleanup for connection termination.
     * 
     * @param userId Recipient user identifier
     * @param emitter The emitter instance from the controller
     */
    public void addEmitter(Long userId, SseEmitter emitter) {
        log.info("Establishing new SSE connection for user: {}", userId);
        
        emitter.onCompletion(() -> {
            log.debug("SSE connection completed for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            log.debug("SSE connection timed out for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onError((ex) -> {
            log.error("SSE connection encounterred error for user: {}", userId, ex);
            emitters.remove(userId);
        });

        emitters.put(userId, emitter);
    }

    /**
     * Explicitly terminates and removes a user's SSE connection.
     * @param userId Target user ID
     */
    public void removeEmitter(Long userId) {
        log.info("Manually removing SSE connection for user: {}", userId);
        emitters.remove(userId);
    }

    /**
     * Attempts to send a live data payload to a user.
     * If no emitter is found, the data is not sent (caller usually handles DB persistence).
     * 
     * @param userId Recipient user ID
     * @param data Payload to serialize and send
     */
    public void send(Long userId, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(data));
                log.info("Pushed real-time notification to user: {}", userId);
            } catch (IOException e) {
                log.error("Failed to push SSE to user: {}, clearing stale connection", userId, e);
                emitters.remove(userId);
            }
        } else {
            log.trace("Suppressed real-time push: No active connection for user {}", userId);
        }
    }

    /**
     * Periodically broadcasts a small package to all connected clients.
     * Helps identify and purge "zombie" connections that have been dropped 
     * silently by the network.
     */
    public void sendHeartbeat() {
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                        .name("heartbeat")
                        .data("keep-alive"));
            } catch (IOException e) {
                log.warn("Sweeping stale SSE connection for user: {}", userId);
                emitters.remove(userId);
            }
        });
    }
}
