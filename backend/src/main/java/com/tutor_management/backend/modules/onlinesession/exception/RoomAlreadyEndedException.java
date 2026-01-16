package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a live teaching room has already ended.
 */
@ResponseStatus(HttpStatus.GONE)
public class RoomAlreadyEndedException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructs a new RoomAlreadyEndedException with the specified message.
     *
     * @param message the detail message explaining why the room was already ended
     */
    public RoomAlreadyEndedException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new RoomAlreadyEndedException with the specified message and cause.
     *
     * @param message the detail message explaining why the room was already ended
     * @param cause the underlying cause (preserved for stack trace)
     */
    public RoomAlreadyEndedException(String message, Throwable cause) {
        super(message, cause);
    }
}
