package com.tutor_management.backend.modules.course;

import com.tutor_management.backend.modules.lesson.Lesson;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Mapping entity that links a Course to its constituent Lessons.
 * Defines the sequential order of lessons within a specific course.
 */
@Entity
@Table(name = "course_lessons", uniqueConstraints = {
        @UniqueConstraint(name = "uk_course_lesson", columnNames = { "course_id", "lesson_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The parent course containing this lesson.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    /**
     * The shared lesson content included in this course.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    /**
     * The sort order of this lesson within the parent course.
     */
    @Column(name = "lesson_order", nullable = false)
    private Integer lessonOrder;

    /**
     * If true, the student must complete this lesson to achieve course completion.
     */
    @Column(name = "is_required")
    @Builder.Default
    private Boolean isRequired = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
