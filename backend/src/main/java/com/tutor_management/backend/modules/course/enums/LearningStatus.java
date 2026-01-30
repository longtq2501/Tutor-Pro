package com.tutor_management.backend.modules.course.enums;

import lombok.Getter;

/**
 * Enum representing the learning progress status of a lesson.
 * Used to provide clear visual feedback to students and tutors.
 */
@Getter
public enum LearningStatus {
    /**
     * Student has not started watching the lesson video (0% progress).
     */
    NOT_STARTED("Chưa học", "gray"),
    
    /**
     * Student is actively learning but hasn't reached unlock threshold (1-69% progress).
     */
    IN_PROGRESS("Đang học", "yellow"),
    
    /**
     * Student has watched enough to unlock next lesson (70-99% progress).
     */
    ALMOST_COMPLETE("Gần hoàn thành", "blue"),
    
    /**
     * Student has completed the entire lesson video (100% progress).
     */
    COMPLETED("Đã hoàn thành", "green");
    
    private final String displayName;
    private final String colorHint;
    
    LearningStatus(String displayName, String colorHint) {
        this.displayName = displayName;
        this.colorHint = colorHint;
    }
}
