package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for course-aware lesson navigation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseNavigationResponse {
    // Course context
    private Long courseId;
    private String courseTitle;
    
    // Current lesson
    private Long currentLessonId;
    private Integer currentLessonOrder;
    private Integer currentProgress;
    
    // Previous lesson
    private Long previousLessonId;
    private String previousLessonTitle;
    private Boolean hasPrevious;
    
    // Next lesson
    private Long nextLessonId;
    private String nextLessonTitle;
    private Boolean hasNext;
    private Boolean canNavigateNext;
    private String nextLessonLockedReason;
    
    // Overall course progress
    private Integer totalLessons;
    private Integer completedLessons;
    private Integer courseProgressPercentage;
}
