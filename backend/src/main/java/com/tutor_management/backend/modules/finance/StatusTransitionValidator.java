package com.tutor_management.backend.modules.finance;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Validator for enforcing session status transitions using a Finite State Machine (FSM) pattern.
 * Defines the legal lifecycle paths for a {@link SessionRecord}.
 */
@Slf4j
@Component
public class StatusTransitionValidator {

    private static final Map<LessonStatus, List<LessonStatus>> ALLOWED_TRANSITIONS = Map.of(
            LessonStatus.SCHEDULED, List.of(
                    LessonStatus.CONFIRMED,
                    LessonStatus.COMPLETED,
                    LessonStatus.PAID,
                    LessonStatus.CANCELLED_BY_TUTOR,
                    LessonStatus.CANCELLED_BY_STUDENT),

            LessonStatus.CONFIRMED, List.of(
                    LessonStatus.COMPLETED,
                    LessonStatus.PAID,
                    LessonStatus.CANCELLED_BY_TUTOR,
                    LessonStatus.CANCELLED_BY_STUDENT),

            LessonStatus.COMPLETED, List.of(
                    LessonStatus.PAID,
                    LessonStatus.PENDING_PAYMENT,
                    LessonStatus.CANCELLED_BY_TUTOR,
                    LessonStatus.CANCELLED_BY_STUDENT,
                    LessonStatus.CONFIRMED),

            LessonStatus.PENDING_PAYMENT, List.of(
                    LessonStatus.PAID,
                    LessonStatus.COMPLETED,
                    LessonStatus.CANCELLED_BY_TUTOR,
                    LessonStatus.CANCELLED_BY_STUDENT),

            LessonStatus.PAID, List.of(
                    LessonStatus.COMPLETED,
                    LessonStatus.CANCELLED_BY_TUTOR,
                    LessonStatus.CANCELLED_BY_STUDENT),

            LessonStatus.CANCELLED_BY_STUDENT, List.of(LessonStatus.SCHEDULED),
            LessonStatus.CANCELLED_BY_TUTOR, List.of(LessonStatus.SCHEDULED));

    /**
     * Validates if a transition from one status to another is permitted.
     * 
     * @param from The current status.
     * @param to The target status.
     * @throws InvalidStatusTransitionException if the transition violates business rules.
     */
    public void validate(LessonStatus from, LessonStatus to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        if (from == to) return;

        List<LessonStatus> allowedTargets = ALLOWED_TRANSITIONS.getOrDefault(from, List.of());

        if (!allowedTargets.contains(to)) {
            log.warn("Invalid transition: {} -> {}", from, to);
            throw new InvalidStatusTransitionException(
                    from,
                    to,
                    String.format("Chuyển đổi trạng thái từ %s sang %s không hợp lệ. Các trạng thái tiếp theo có thể: %s",
                            from.getDisplayName(),
                            to.getDisplayName(),
                            formatAllowedStatuses(allowedTargets)));
        }
    }

    /**
     * Checks if a transition is allowed without throwing an exception.
     */
    public boolean isTransitionAllowed(LessonStatus from, LessonStatus to) {
        if (from == null || to == null) return false;
        if (from == to) return true;
        return ALLOWED_TRANSITIONS.getOrDefault(from, List.of()).contains(to);
    }

    private String formatAllowedStatuses(List<LessonStatus> statuses) {
        if (statuses.isEmpty()) return "Không có";
        return statuses.stream()
                .map(LessonStatus::getDisplayName)
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
    }
}
