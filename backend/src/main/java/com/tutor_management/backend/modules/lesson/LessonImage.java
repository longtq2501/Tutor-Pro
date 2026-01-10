package com.tutor_management.backend.modules.lesson;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Image asset associated with a {@link Lesson}.
 * Part of a gallery shown within the lesson content.
 */
@Entity
@Table(name = "lesson_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "lesson")
public class LessonImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    /**
     * Permanent URL to the hosted image asset.
     */
    @Column(nullable = false, length = 1000)
    private String imageUrl;

    /**
     * Optional text description shown below the image.
     */
    @Column(length = 500)
    private String caption;

    /**
     * Order of appearance within the lesson gallery.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
