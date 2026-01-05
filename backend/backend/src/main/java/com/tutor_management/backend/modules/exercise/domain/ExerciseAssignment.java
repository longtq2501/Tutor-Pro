package com.tutor_management.backend.modules.exercise.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_assignments", indexes = {
    @Index(name = "idx_assignment_exercise_id", columnList = "exercise_id"),
    @Index(name = "idx_assignment_student_id", columnList = "student_id"),
    @Index(name = "idx_assignment_assigned_by", columnList = "assigned_by")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseAssignment {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(name = "exercise_id", nullable = false, length = 36)
    private String exerciseId;
    
    @Column(name = "student_id", nullable = false, length = 36)
    private String studentId;
    
    @Column(name = "assigned_by", nullable = false, length = 36)
    private String assignedBy; // Teacher/Tutor ID
    
    @Column(name = "assigned_at")
    @CreationTimestamp
    private LocalDateTime assignedAt;
    
    @Column(name = "deadline")
    private LocalDateTime deadline; // Can override exercise deadline
    
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
