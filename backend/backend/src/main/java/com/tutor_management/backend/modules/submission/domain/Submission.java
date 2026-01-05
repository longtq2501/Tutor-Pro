package com.tutor_management.backend.modules.submission.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Submission entity representing a student's submission for an exercise
 */
@Entity
@Table(name = "submissions", indexes = {
    @Index(name = "idx_submission_exercise_id", columnList = "exercise_id"),
    @Index(name = "idx_submission_student_id", columnList = "student_id"),
    @Index(name = "idx_submission_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    
    @Id
    @Column(length = 36)
    private String id;
    
    /**
     * Exercise ID this submission is for
     */
    @Column(name = "exercise_id", nullable = false, length = 36)
    private String exerciseId;
    
    /**
     * Student ID who made this submission
     */
    @Column(name = "student_id", nullable = false, length = 36)
    private String studentId;
    
    /**
     * Status of the submission
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.DRAFT;
    
    /**
     * Score for MCQ questions (auto-graded)
     */
    @Column(name = "mcq_score")
    @Builder.Default
    private Integer mcqScore = 0;
    
    /**
     * Score for essay questions (manually graded)
     */
    @Column(name = "essay_score")
    @Builder.Default
    private Integer essayScore = 0;
    
    /**
     * Total score (mcqScore + essayScore)
     */
    @Column(name = "total_score")
    @Builder.Default
    private Integer totalScore = 0;
    
    /**
     * When the student submitted
     */
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    /**
     * When the teacher graded
     */
    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
    
    /**
     * Teacher's overall comment
     */
    @Column(name = "teacher_comment", columnDefinition = "TEXT")
    private String teacherComment;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Student's answers
     */
    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    private List<StudentAnswer> answers = new ArrayList<>();
    
    /**
     * Helper method to add an answer
     */
    public void addAnswer(StudentAnswer answer) {
        answers.add(answer);
        answer.setSubmission(this);
    }
    
    /**
     * Helper method to remove an answer
     */
    public void removeAnswer(StudentAnswer answer) {
        answers.remove(answer);
        answer.setSubmission(null);
    }
    
    /**
     * Calculate and update total score
     */
    public void calculateTotalScore() {
        this.totalScore = (mcqScore != null ? mcqScore : 0) + (essayScore != null ? essayScore : 0);
    }
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
