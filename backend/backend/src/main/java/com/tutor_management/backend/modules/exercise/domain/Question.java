package com.tutor_management.backend.modules.exercise.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Question entity representing a single question in an exercise
 */
@Entity
@Table(name = "questions", indexes = {
    @Index(name = "idx_question_exercise_id", columnList = "exercise_id"),
    @Index(name = "idx_question_order", columnList = "exercise_id, order_index")
})
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @EqualsAndHashCode.Include
    @Column(length = 36)
    private String id;
    
    /**
     * Reference to the parent exercise
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    @JsonBackReference
    private Exercise exercise;
    
    /**
     * Type of question (MCQ or ESSAY)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QuestionType type;
    
    /**
     * The question text
     */
    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    /**
     * Points awarded for correct answer
     */
    @Column(nullable = false)
    private Integer points;
    
    /**
     * Order index for sorting questions
     */
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    /**
     * Rubric for essay questions (optional)
     */
    @Column(columnDefinition = "TEXT")
    private String rubric;
    
    /**
     * Options for MCQ questions
     */
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("label ASC")
    @JsonManagedReference
    @Builder.Default
    private Set<Option> options = new LinkedHashSet<>();
    
    /**
     * Helper method to add an option to the question
     */
    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }
    
    /**
     * Helper method to remove an option from the question
     */
    public void removeOption(Option option) {
        options.remove(option);
        option.setQuestion(null);
    }
    
    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = java.util.UUID.randomUUID().toString();
        }
    }
}
