package com.tutor_management.backend.modules.exercise.domain;

/**
 * Defines the lifecycle states of an exercise within the administrative library.
 */
public enum ExerciseStatus {
    /**
     * Under construction; hidden from students and cannot be assigned.
     */
    DRAFT,
    
    /**
     * Active and ready to be assigned or viewed by students.
     */
    PUBLISHED,
    
    /**
     * Retired from active use; preserved for historical records but cannot be newly assigned.
     */
    ARCHIVED
}
