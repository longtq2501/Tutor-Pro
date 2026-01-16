package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a user does not have permission to access a live teaching room.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class RoomAccessDeniedException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructs a new RoomAccessDeniedException with the specified message.
     *
     * @param message the detail message explaining why the room access was denied
     */
    public RoomAccessDeniedException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new RoomAccessDeniedException with the specified message and cause.
     *
     * @param message the detail message explaining why the room access was denied
     * @param cause the underlying cause (preserved for stack trace)
     */
    public RoomAccessDeniedException(String message, Throwable cause) {
        super(message, cause);
    }
}
