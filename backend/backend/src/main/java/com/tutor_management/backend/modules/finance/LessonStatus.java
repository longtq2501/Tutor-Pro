package com.tutor_management.backend.modules.finance;

import lombok.Getter;

/**
 * Enum representing the lifecycle states of a lesson/session.
 * 
 * State transitions follow a finite state machine (FSM) pattern.
 * See status_fsm.md for detailed transition rules.
 * 
 * @author AI Agent
 * @since 2025-12-26
 */
@Getter
public enum LessonStatus {
    
    /**
     * Lesson has been scheduled but not yet confirmed by student.
     * Initial state when creating a new lesson.
     */
    SCHEDULED("Đã hẹn"),
    
    /**
     * Student has confirmed they will attend the lesson.
     */
    CONFIRMED("Đã xác nhận"),
    
    /**
     * Lesson has been completed/taught but payment not yet received.
     */
    COMPLETED("Đã dạy"),
    
    /**
     * Lesson completed and payment has been received.
     * This is a terminal state (no further transitions).
     */
    PAID("Đã thanh toán"),
    
    /**
     * Student has submitted payment proof, waiting for tutor confirmation.
     */
    PENDING_PAYMENT("Chờ xác nhận thanh toán"),
    
    /**
     * Lesson was cancelled by the student.
     * This is a terminal state (no further transitions).
     */
    CANCELLED_BY_STUDENT("Học sinh hủy"),
    
    /**
     * Lesson was cancelled by the tutor.
     * This is a terminal state (no further transitions).
     */
    CANCELLED_BY_TUTOR("Tutor hủy");

    /**
     * -- GETTER --
     *  Get the Vietnamese display name for this status.
     *
     * @return Vietnamese display name
     */
    private final String displayName;
    
    LessonStatus(String displayName) {
        this.displayName = displayName;
    }

    /**
     * Check if this status is a terminal state (no further transitions allowed).
     * 
     * @return true if terminal state, false otherwise
     */
    public boolean isTerminal() {
        return this == PAID || 
               this == CANCELLED_BY_STUDENT || 
               this == CANCELLED_BY_TUTOR;
    }
    
    /**
     * Check if this status represents a completed lesson (taught).
     * 
     * @return true if lesson has been taught
     */
    public boolean isCompleted() {
        return this == COMPLETED || 
               this == PENDING_PAYMENT || 
               this == PAID;
    }
    
    /**
     * Check if this status represents a paid lesson.
     * 
     * @return true if payment has been received
     */
    public boolean isPaid() {
        return this == PAID;
    }
    
    /**
     * Check if this status represents a cancelled lesson.
     * 
     * @return true if lesson was cancelled
     */
    public boolean isCancelled() {
        return this == CANCELLED_BY_STUDENT || 
               this == CANCELLED_BY_TUTOR;
    }
}
