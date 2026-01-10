package com.tutor_management.backend.modules.exercise.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Join entity representing an instance of an exercise being assigned to a specific student.
 * Tracks session-specific metadata like completion status and custom deadlines.
 */
@Entity
@Table(name = "exercise_assignments", indexes = {
    @Index(name = "idx_assignment_exercise_id", columnList = "exercise_id"),
    @Index(name = "idx_assignment_student_id", columnList = "student_id"),
    @Index(name = "idx_assignment_assigned_by", columnList = "assigned_by")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseAssignment {
    
    @Id
    @Column(length = 36)
    private String id;
    
    /**
     * UUID of the source exercise resource.
     */
    @Column(name = "exercise_id", nullable = false, length = 36)
    private String exerciseId;
    
    /**
     * UUID of the student recipient.
     */
    @Column(name = "student_id", nullable = false, length = 36)
    private String studentId;
    
    /**
     * UUID of the staff member who authorized this assignment.
     */
    @Column(name = "assigned_by", nullable = false, length = 36)
    private String assignedBy;
    
    @Column(name = "assigned_at")
    @CreationTimestamp
    private LocalDateTime assignedAt;
    
    /**
     * Customized cutoff time for this specific assignment.
     * Often overrides the global exercise deadline.
     */
    @Column(name = "deadline")
    private LocalDateTime deadline;
    
    /**
     * Progression status (ASSIGNED, STARTED, COMPLETED).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.ASSIGNED;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
