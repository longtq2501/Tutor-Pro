package com.tutor_management.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String phone;

    @Column(nullable = false)
    private String schedule;

    @Column(nullable = false)
    private Long pricePerHour;

    @Column(length = 1000)
    private String notes;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true; // Thêm trường active

    private String startMonth; // Thêm trường startMonth
    private String lastActiveMonth; // Thêm trường lastActiveMonth

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}