package com.tutor_management.backend.modules.finance;

import lombok.Getter;

/**
 * Exception thrown when an invalid status transition is attempted.
 * 
 * For example, trying to transition from SCHEDULED directly to PAID
 * without going through CONFIRMED and COMPLETED states.
 * 
 * @author AI Agent
 * @since 2025-12-26
 */
@Getter
public class InvalidStatusTransitionException extends RuntimeException {
    
    private final LessonStatus fromStatus;
    private final LessonStatus toStatus;
    
    public InvalidStatusTransitionException(String message) {
        super(message);
        this.fromStatus = null;
        this.toStatus = null;
    }
    
    public InvalidStatusTransitionException(LessonStatus fromStatus, LessonStatus toStatus) {
        super(String.format(
            "Không thể chuyển từ trạng thái %s (%s) sang %s (%s)",
            fromStatus.name(),
            fromStatus.getDisplayName(),
            toStatus.name(),
            toStatus.getDisplayName()
        ));
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
    }
    
    public InvalidStatusTransitionException(LessonStatus fromStatus, LessonStatus toStatus, String reason) {
        super(String.format(
            "Không thể chuyển từ trạng thái %s (%s) sang %s (%s). Lý do: %s",
            fromStatus.name(),
            fromStatus.getDisplayName(),
            toStatus.name(),
            toStatus.getDisplayName(),
            reason
        ));
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
    }

}
