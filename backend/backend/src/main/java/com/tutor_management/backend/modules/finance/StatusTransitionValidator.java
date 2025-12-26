package com.tutor_management.backend.modules.finance;

import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * Validator for lesson status transitions following FSM (Finite State Machine)
 * pattern.
 * 
 * Ensures that status changes follow valid transition paths.
 * For example: SCHEDULED → CONFIRMED → COMPLETED → PAID
 * 
 * See status_fsm.md for detailed state diagram and transition rules.
 * 
 * @author AI Agent
 * @since 2025-12-26
 */
@Slf4j
@Component
public class StatusTransitionValidator {

    /**
     * Allowed state transitions map.
     * Key: Current status
     * Value: List of allowed next statuses
     */
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
                    LessonStatus.PENDING_PAYMENT),

            LessonStatus.PENDING_PAYMENT, List.of(
                    LessonStatus.PAID,
                    LessonStatus.COMPLETED // Allow rejection back to completed
            ),

            // Terminal states - no further transitions allowed
            LessonStatus.PAID, List.of(),
            LessonStatus.CANCELLED_BY_STUDENT, List.of(),
            LessonStatus.CANCELLED_BY_TUTOR, List.of());

    /**
     * Validate if transition from 'from' status to 'to' status is allowed.
     * 
     * @param from Current status
     * @param to   Target status
     * @throws InvalidStatusTransitionException if transition is not allowed
     */
    public void validate(LessonStatus from, LessonStatus to) {
        if (from == null || to == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }

        // Same status is always allowed (no-op)
        if (from == to) {
            log.debug("Status transition: {} -> {} (no change)", from, to);
            return;
        }

        List<LessonStatus> allowedTargets = ALLOWED_TRANSITIONS.getOrDefault(from, List.of());

        if (!allowedTargets.contains(to)) {
            log.warn("Invalid status transition attempted: {} -> {}", from, to);
            throw new InvalidStatusTransitionException(
                    from,
                    to,
                    String.format("Các trạng thái hợp lệ từ %s: %s",
                            from.getDisplayName(),
                            formatAllowedStatuses(allowedTargets)));
        }

        log.info("Valid status transition: {} -> {}", from, to);
    }

    /**
     * Get all allowed next states from current state.
     * 
     * @param current Current status
     * @return List of allowed next statuses
     */
    public List<LessonStatus> getAllowedNextStates(LessonStatus current) {
        if (current == null) {
            return List.of();
        }
        return ALLOWED_TRANSITIONS.getOrDefault(current, List.of());
    }

    /**
     * Check if a state is terminal (no further transitions allowed).
     * 
     * @param status Status to check
     * @return true if terminal state, false otherwise
     */
    public boolean isTerminalState(LessonStatus status) {
        if (status == null) {
            return false;
        }
        return ALLOWED_TRANSITIONS.getOrDefault(status, List.of()).isEmpty();
    }

    /**
     * Check if transition is allowed without throwing exception.
     * 
     * @param from Current status
     * @param to   Target status
     * @return true if transition is allowed, false otherwise
     */
    public boolean isTransitionAllowed(LessonStatus from, LessonStatus to) {
        if (from == null || to == null) {
            return false;
        }

        if (from == to) {
            return true;
        }

        List<LessonStatus> allowedTargets = ALLOWED_TRANSITIONS.getOrDefault(from, List.of());
        return allowedTargets.contains(to);
    }

    /**
     * Format allowed statuses for error message.
     */
    private String formatAllowedStatuses(List<LessonStatus> statuses) {
        if (statuses.isEmpty()) {
            return "Không có (trạng thái cuối)";
        }

        return statuses.stream()
                .map(s -> s.getDisplayName() + " (" + s.name() + ")")
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
    }
}
