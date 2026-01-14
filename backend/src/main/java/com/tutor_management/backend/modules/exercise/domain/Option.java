package com.tutor_management.backend.modules.exercise.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.domain.Persistable;

/**
 * Specifically typed selection for multiple-choice questions.
 * Maps a label (e.g., 'A') to meaningful text and correct/incorrect status.
 */
@Entity
@Table(name = "options", indexes = {
    @Index(name = "idx_option_question_id", columnList = "question_id")
})
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Option implements Persistable<String> {
    
    @Id
    @EqualsAndHashCode.Include
    @Column(length = 36)
    @Builder.Default
    private String id = java.util.UUID.randomUUID().toString();
    
    @Transient
    @Builder.Default
    @JsonIgnore
    private boolean isNew = true;

    @Override
    public boolean isNew() {
        return isNew;
    }
    
    /**
     * The MCQ question this option belongs to.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;
    
    /**
     * Identifier for the option (e.g., "A", "B", "C", "D").
     */
    @Column(nullable = false, length = 1)
    private String label;
    
    /**
     * The content displayed for this choice.
     */
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
    
    /**
     * Flags this option as the required selection for scoring points.
     */
    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
    
    @PostPersist
    @PostLoad
    protected void markNotNew() {
        this.isNew = false;
    }
}
