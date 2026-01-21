package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a user is not authorized to convert a session.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedSessionConversionException extends RuntimeException {
    public UnauthorizedSessionConversionException(Long tutorId, Long sessionId) {
        super(String.format("Gia sư với ID %d không có quyền chuyển đổi buổi học ID %d sang chế độ Online.", tutorId, sessionId));
    }
}
