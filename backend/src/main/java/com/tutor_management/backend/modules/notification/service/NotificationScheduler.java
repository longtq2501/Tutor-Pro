package com.tutor_management.backend.modules.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Component responsible for periodic background tasks related to notifications.
 * Currently manages SSE connection health via heartbeats.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final SseEmittersManager sseEmittersManager;

    /**
     * Sends a keep-alive heartbeat to all connected SSE clients every 30 seconds.
     * 
     * This prevents intermediate networking components (Nginx, Docker, etc.)
     * from closing idle connections due to inactivity.
     */
    @Scheduled(fixedRate = 30000)
    public void sendHeartbeat() {
        log.trace("Executing SSE heartbeat broadcast");
        sseEmittersManager.sendHeartbeat();
    }
}
