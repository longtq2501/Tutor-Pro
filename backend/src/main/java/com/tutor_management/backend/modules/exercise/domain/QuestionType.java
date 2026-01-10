package com.tutor_management.backend.modules.exercise.domain;

/**
 * Classification of question formats supported by the exercise engine.
 */
public enum QuestionType {
    /**
     * Multiple choice question with structured options (e.g., A, B, C, D).
     * Typically auto-gradable.
     */
    MCQ,
    
    /**
     * Open-ended written response. Requires manual evaluation or AI feedback.
     */
    ESSAY
}
