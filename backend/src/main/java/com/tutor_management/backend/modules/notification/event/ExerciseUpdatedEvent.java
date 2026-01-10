package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Event published when an existing exercise is updated by a tutor.
 */
@Getter
@AllArgsConstructor
@Builder
public class ExerciseUpdatedEvent {
    /** ID of the updated exercise */
    private final String exerciseId;
    
    /** Updated title of the exercise */
    private final String exerciseTitle;
    
    /** Name of the tutor who performed the update */
    private final String tutorName;
}
