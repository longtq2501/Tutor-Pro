package com.tutor_management.backend.modules.onlinesession.enums;

/**
 * Enum representing the status of an online session room.
 */
public enum RoomStatus {
    /**
     * Room created, waiting for participants to join.
     */
    WAITING,

    /**
     * Session is currently active with participants present.
     */
    ACTIVE,

    /**
     * Session has ended.
     */
    ENDED
}