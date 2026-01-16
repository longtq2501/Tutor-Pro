package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a live teaching room is not found.
 * 
 * <p>This exception is mapped to HTTP 404 NOT FOUND status.
 * 
 * @see RoomAccessDeniedException
 * @see RoomAlreadyEndedException
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class RoomNotFoundException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructs a new RoomNotFoundException with the specified message.
     *
     * @param message the detail message explaining why the room was not found
     */
    public RoomNotFoundException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new RoomNotFoundException with the specified message and cause.
     *
     * @param message the detail message
     * @param cause the underlying cause (preserved for stack trace)
     */
    public RoomNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}