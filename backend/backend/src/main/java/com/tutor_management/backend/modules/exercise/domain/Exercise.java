package com.tutor_management.backend.modules.exercise.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Exercise entity representing a test/assignment for students
 */
@Entity
@Table(name = "exercises", indexes = {
    @Index(name = "idx_exercise_class_id", columnList = "class_id"),
    @Index(name = "idx_exercise_created_by", columnList = "created_by"),
    @Index(name = "idx_exercise_status", columnList = "status")
})
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {
    
    @Id
    @EqualsAndHashCode.Include
    @Column(length = 36)
    private String id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Time limit in minutes
     */
    @Column(name = "time_limit")
    private Integer timeLimit;
    
    /**
     * Total points for the exercise
     */
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;
    
    /**
     * Deadline for submission
     */
    @Column(name = "deadline")
    private LocalDateTime deadline;
    
    /**
     * Status of the exercise
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ExerciseStatus status = ExerciseStatus.DRAFT;
    
    /**
     * Class ID for filtering exercises by class
     */
    @Column(name = "class_id", length = 36)
    private String classId;
    
    /**
     * Teacher ID who created this exercise
     */
    @Column(name = "created_by", nullable = false, length = 36)
    private String createdBy;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Questions in this exercise
     */
    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @JsonManagedReference
    @Builder.Default
    private Set<Question> questions = new LinkedHashSet<>();
    
    /**
     * Helper method to add a question to the exercise
     */
    public void addQuestion(Question question) {
        questions.add(question);
        question.setExercise(this);
    }
    
    /**
     * Helper method to remove a question from the exercise
     */
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setExercise(null);
    }
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
