package com.tutor_management.backend.annotation;

import com.tutor_management.backend.modules.onlinesession.dto.request.CreateOnlineSessionRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ScheduledTimeValidator implements ConstraintValidator<ValidScheduledTime, CreateOnlineSessionRequest> {

    @Override
    public boolean isValid(CreateOnlineSessionRequest request, ConstraintValidatorContext context) {
        if (request.getScheduledStart() == null || request.getScheduledEnd() == null) {
            return true; // Let @NotNull handle this
        }

        boolean isValid = request.getScheduledEnd().isAfter(request.getScheduledStart());

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Scheduled end must be after scheduled start"
            ).addConstraintViolation();
        }

        return isValid;
    }
}
