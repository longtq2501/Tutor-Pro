package com.tutor_management.backend.modules.exercise.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Summary DTO for a student's exercise progression, used in the Tutor Dashboard.
 */
@Data
@Builder
public class TutorStudentSummaryResponse {
    private String studentId;
    private String studentName;
    private String grade; // Optional: student level
    
    // Performance Metrics
    private Integer pendingCount;
    private Integer submittedCount;
    private Integer gradedCount;
    private Integer totalAssigned;
    
    // Quick list of recent items
    private List<ExerciseStatusSummary> recentExercises;

    @Data
    @Builder
    public static class ExerciseStatusSummary {
        private String exerciseId;
        private String title;
        private String status;
        private Integer score;
    }
}
