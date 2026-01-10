package com.tutor_management.backend.modules.parent;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tutor_management.backend.modules.student.Student;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Domain entity representing a Parent/Guardian in the system.
 * A parent can be associated with multiple students.
 */
@Entity
@Table(name = "parents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Full name of the parent.
     */
    @Column(nullable = false)
    private String name;

    /**
     * Contact phone number.
     */
    private String phone;

    /**
     * Primary contact email, used for communications and identification.
     */
    @Column(unique = true)
    private String email;

    /**
     * Internal notes or additional information about the parent.
     */
    @Column(length = 500)
    private String notes;

    /**
     * List of students associated with this parent.
     */
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    private List<Student> students = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
