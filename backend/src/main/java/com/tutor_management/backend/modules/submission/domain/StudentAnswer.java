package com.tutor_management.backend.modules.submission.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Persistable;

/**
 * StudentAnswer entity representing a student's answer to a question
 */
@Entity
@Table(name = "student_answers", indexes = {
    @Index(name = "idx_answer_submission_id", columnList = "submission_id"),
    @Index(name = "idx_answer_question_id", columnList = "question_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnswer implements Persistable<String> {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Transient
    @Builder.Default
    @JsonIgnore
    private boolean isNew = true;

    @Override
    public boolean isNew() {
        return isNew;
    }
    
    /**
     * Reference to the submission
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonBackReference
    private Submission submission;
    
    /**
     * Question ID this answer is for
     */
    @Column(name = "question_id", nullable = false, length = 36)
    private String questionId;
    
    /**
     * Selected option for MCQ (A, B, C, D) - null for essay
     */
    @Column(name = "selected_option", length = 1)
    private String selectedOption;
    
    /**
     * Essay text for essay questions - null for MCQ
     */
    @Column(name = "essay_text", columnDefinition = "TEXT")
    private String essayText;
    
    /**
     * Whether the MCQ answer is correct (auto-graded)
     */
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    /**
     * Points awarded for this answer
     */
    @Column(name = "points")
    @Builder.Default
    private Integer points = 0;
    
    /**
     * Teacher's feedback for essay questions
     */
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }

    @PostPersist
    @PostLoad
    protected void markNotNew() {
        this.isNew = false;
    }
}
