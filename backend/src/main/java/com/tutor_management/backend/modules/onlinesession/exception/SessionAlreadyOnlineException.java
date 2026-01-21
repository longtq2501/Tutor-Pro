package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when attempting to convert a session that is already online.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class SessionAlreadyOnlineException extends RuntimeException {
    public SessionAlreadyOnlineException(Long sessionId) {
        super("Buổi học với ID " + sessionId + " đã được chuyển sang chế độ Online.");
    }
}
