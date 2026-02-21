package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Lesson representation with personal completion tracking for students.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseLessonDTO {
    private Long id;
    private Long lessonId;
    private String title;
    private String summary;
    private Integer lessonOrder;
    private Boolean isRequired;
    
    /**
     * Whether this specific student has finished the lesson.
     */
    private Boolean isCompleted;
    
    /**
     * The timestamp when the student marked this lesson as complete.
     */
    private LocalDateTime completedAt;

    /**
     * Video watch percentage (0-100).
     */
    private Integer videoProgress;

    /**
     * Whether the student can unlock the next lesson in the curriculum.
     */
    private Boolean canUnlockNext;
}
