package com.tutor_management.backend.modules.exercise.domain;

/**
 * Status of an exercise
 */
public enum ExerciseStatus {
    /**
     * Exercise is being created/edited, not visible to students
     */
    DRAFT,
    
    /**
     * Exercise is published and visible to students
     */
    PUBLISHED,
    
    /**
     * Exercise is archived, no longer active
     */
    ARCHIVED
}
