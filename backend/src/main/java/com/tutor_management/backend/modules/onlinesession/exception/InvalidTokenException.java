package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a room authentication token is invalid.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class InvalidTokenException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    
    /**
     * Constructs a new InvalidTokenException with the specified message.
     *
     * @param message the detail message explaining why the token is invalid
     */
    public InvalidTokenException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new InvalidTokenException with the specified message and cause.
     *
     * @param message the detail message explaining why the token is invalid
     * @param cause the underlying cause (preserved for stack trace)
     */
    public InvalidTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
