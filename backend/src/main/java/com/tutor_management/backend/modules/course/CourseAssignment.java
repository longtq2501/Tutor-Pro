package com.tutor_management.backend.modules.course;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.tutor_management.backend.modules.course.enums.AssignmentStatus;
import com.tutor_management.backend.modules.student.Student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents the association between a student and a course.
 * Tracks progress, deadlines, and completion status for a specific enrollment.
 */
@Entity
@Table(name = "course_assignments", uniqueConstraints = {
        @UniqueConstraint(name = "uk_course_student", columnNames = { "course_id", "student_id" })
}, indexes = {
        @Index(name = "idx_ca_student_id", columnList = "student_id"),
        @Index(name = "idx_ca_course_id", columnList = "course_id"),
        @Index(name = "idx_ca_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The course that has been assigned.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * The student enrolled in this course assignment.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    /**
     * The timestamp when this course was assigned to the student.
     */
    @CreationTimestamp
    @Column(name = "assigned_date", updatable = false)
    private LocalDateTime assignedDate;

    /**
     * The deadline by which the student should complete the course.
     */
    @Column(name = "deadline")
    private LocalDateTime deadline;

    /**
     * Current workflow status of the assignment.
     */
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AssignmentStatus status = AssignmentStatus.NOT_STARTED;

    /**
     * Calculated completion percentage based on lesson progress.
     */
    @Column(name = "progress_percentage")
    @Builder.Default
    private Integer progressPercentage = 0;

    /**
     * The timestamp when the student finished the final required lesson.
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
}
