package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Event published when a new exercise is assigned to a student.
 */
@Getter
@AllArgsConstructor
@Builder
public class ExerciseAssignedEvent {
    /** ID of the newly assigned exercise */
    private final String exerciseId;
    
    /** Title of the exercise */
    private final String exerciseTitle;
    
    /** ID of the recipient student */
    private final String studentId;
    
    /** Name of the tutor who assigned the exercise */
    private final String tutorName;
}
