package com.tutor_management.backend.modules.exercise.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Persistable;

/**
 * Option entity representing a single option in a multiple choice question
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
     * Reference to the parent question
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private Question question;
    
    /**
     * Option label (A, B, C, D)
     */
    @Column(nullable = false, length = 1)
    private String label;
    
    /**
     * The option text
     */
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
    
    /**
     * Whether this option is the correct answer
     */
    @Column(name = "is_correct", nullable = false)
    @Builder.Default
    private Boolean isCorrect = false;
    
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
