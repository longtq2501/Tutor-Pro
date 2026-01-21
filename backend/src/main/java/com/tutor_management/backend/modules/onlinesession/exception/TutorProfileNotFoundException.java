package com.tutor_management.backend.modules.onlinesession.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when a tutor profile is not found for a user.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TutorProfileNotFoundException extends RuntimeException {
    public TutorProfileNotFoundException(Long userId) {
        super("Không tìm thấy hồ sơ gia sư cho user ID: " + userId);
    }
}
