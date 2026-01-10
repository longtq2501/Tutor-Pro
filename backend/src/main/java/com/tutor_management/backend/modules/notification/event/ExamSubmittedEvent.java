package com.tutor_management.backend.modules.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

/**
 * Event published when a student completes and submits an exam.
 */
@Getter
@AllArgsConstructor
@Builder
public class ExamSubmittedEvent {
    /** ID of the new submission */
    private final String submissionId;
    
    /** ID of the student who submitted the exam */
    private final String studentId;
    
    /** Name of the student for display */
    private final String studentName;
    
    /** ID of the associated exercise */
    private final String exerciseId;
    
    /** Title of the exercise */
    private final String exerciseTitle;
    
    /** ID of the tutor who needs to grade this submission */
    private final String tutorId;
}
