package com.tutor_management.backend.modules.course.dto.response;

import com.tutor_management.backend.modules.course.entity.CourseAssignment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO representing a student's enrollment in a course.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseAssignmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private Long studentId;
    private String studentName;
    private LocalDateTime assignedDate;
    private LocalDateTime deadline;
    private String status;
    private Integer progressPercentage;
    private LocalDateTime completedAt;

    /**
     * Maps a CourseAssignment entity to its response representation.
     */
    public static CourseAssignmentResponse fromEntity(CourseAssignment assignment) {
        return CourseAssignmentResponse.builder()
                .id(assignment.getId())
                .courseId(assignment.getCourse().getId())
                .courseTitle(assignment.getCourse().getTitle())
                .studentId(assignment.getStudent().getId())
                .studentName(assignment.getStudent().getName())
                .assignedDate(assignment.getAssignedDate())
                .deadline(assignment.getDeadline())
                .status(assignment.getStatus().name())
                .progressPercentage(assignment.getProgressPercentage())
                .completedAt(assignment.getCompletedAt())
                .build();
    }
}
