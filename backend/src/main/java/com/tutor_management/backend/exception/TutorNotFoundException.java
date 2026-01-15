package com.tutor_management.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class TutorNotFoundException extends RuntimeException {
    public TutorNotFoundException(Long id) {
        super("Tutor not found with id: " + id);
    }
}