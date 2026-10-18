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
    private Integer autoSubmittedCount;
    private Integer exemptedCount;
    private Integer totalAssigned;

    /**
     * Average score across genuinely attempted submissions.
     * Null when the student has no gradable attempt yet.
     */
    private Double averageScore;

    // Quick list of recent items
    private List<ExerciseStatusSummary> recentExercises;

    @Data
    @Builder
    public static class ExerciseStatusSummary {
        private String exerciseId;
        private String title;
        private String status;
        private Integer score;
        private Boolean autoSubmitted;
    }
}
