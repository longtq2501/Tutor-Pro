package com.tutor_management.backend.modules.onlinesession.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for tracking user presence in online rooms using an in-memory map.
 * This avoids excessive database writes for frequent heartbeat updates.
 */
@Service
@Slf4j
public class PresenceService {

    // Key: "roomId:userId", Value: Last activity timestamp
    private final Map<String, LocalDateTime> userPresence = new ConcurrentHashMap<>();

    /**
     * Updates the heartbeat for a user in a specific room.
     * 
     * @param roomId The room identifier.
     * @param userId The user identifier.
     */
    public void updateHeartbeat(String roomId, Long userId) {
        String key = generateKey(roomId, userId);
        userPresence.put(key, LocalDateTime.now());
    }

    /**
     * Checks if a user is active in a room within the specified timeout.
     * 
     * @param roomId The room identifier.
     * @param userId The user identifier.
     * @param timeoutSeconds The timeout threshold in seconds.
     * @return true if active, false otherwise.
     */
    public boolean isUserActive(String roomId, Long userId, int timeoutSeconds) {
        String key = generateKey(roomId, userId);
        LocalDateTime lastActivity = userPresence.get(key);

        if (lastActivity == null) {
            return false;
        }

        return lastActivity.isAfter(LocalDateTime.now().minusSeconds(timeoutSeconds));
    }

    /**
     * Generates a unique key for the presence map.
     */
    private String generateKey(String roomId, Long userId) {
        return roomId + ":" + userId;
    }

    /**
     * Periodically cleans up old entries from the memory to prevent leaks.
     * Runs every 5 minutes.
     */
    @Scheduled(fixedRate = 300000)
    public void cleanupOldEntries() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(2); // Reduced to 2 minutes to match timeout threshold (60s)
        int initialSize = userPresence.size();
        userPresence.entrySet().removeIf(entry -> entry.getValue().isBefore(threshold));
        int removedCount = initialSize - userPresence.size();
        
        if (removedCount > 0) {
            log.info("Cleaned up {} stale presence entries", removedCount);
        }
    }
}
