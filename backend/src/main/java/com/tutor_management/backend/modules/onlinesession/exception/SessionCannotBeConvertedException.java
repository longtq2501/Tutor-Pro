package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a session's status prevents it from being converted.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class SessionCannotBeConvertedException extends RuntimeException {
    public SessionCannotBeConvertedException(String message) {
        super(message);
    }
}
