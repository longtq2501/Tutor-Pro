package com.tutor_management.backend.modules.course.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Minimized lesson representation for course curriculum lists.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseLessonDTO {
    /** Unique mapping ID in the course_lessons table */
    private Long id;
    
    /** Foreign ID to the lesson content */
    private Long lessonId;
    
    /** Display title of the lesson */
    private String title;
    
    /** Brief overview of lesson topics */
    private String summary;
    
    /** Sequence position within the course */
    private Integer lessonOrder;
    
    /** Whether completing this lesson is mandatory */
    private Boolean isRequired;
}
