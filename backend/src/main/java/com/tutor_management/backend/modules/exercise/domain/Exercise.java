package com.tutor_management.backend.modules.exercise.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.domain.Persistable;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Core entity representing a collection of questions designed for student assessment.
 * Supports versioning through draft/published states and can be localized to specific classes.
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
public class Exercise implements Persistable<String> {
    
    @Id
    @EqualsAndHashCode.Include
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
     * Foreign key to owning Tutor (multi-tenancy).
     */
    @Column(name = "tutor_id", nullable = false)
    private Long tutorId;

    /**
     * Primary name/header for the exercise.
     */
    @Column(nullable = false, length = 500)
    private String title;
    
    /**
     * Detailed instructions or context for the assessment.
     */
    @Column(columnDefinition = "TEXT")
    private String description;
    
    /**
     * Maximum duration allowed for completion (in minutes).
     * If null, no strict time limit is enforced.
     */
    @Column(name = "time_limit")
    private Integer timeLimit;
    
    /**
     * Sum of all points available across all included questions.
     */
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;
    
    /**
     * Global cutoff time for submissions.
     */
    @Column(name = "deadline")
    private LocalDateTime deadline;
    
    /**
     * Current availability level (DRAFT, PUBLISHED, ARCHIVED).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ExerciseStatus status = ExerciseStatus.DRAFT;
    
    /**
     * UUID of the class/grouping this exercise belongs to.
     */
    @Column(name = "class_id", length = 36)
    private String classId;
    
    /**
     * UUID of the staff member responsible for this resource.
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
     * Structured set of questions making up the exercise content.
     * Ordered by their logical progression index.
     */
    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @JsonManagedReference
    @BatchSize(size = 20)
    @Builder.Default
    private Set<Question> questions = new LinkedHashSet<>();
    
    /**
     * Bi-directional association helper.
     */
    public void addQuestion(Question question) {
        questions.add(question);
        question.setExercise(this);
    }
    
    /**
     * Bi-directional association helper.
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

    @PostPersist
    @PostLoad
    protected void markNotNew() {
        this.isNew = false;
    }
}
