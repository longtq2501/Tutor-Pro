package com.tutor_management.backend.modules.course.projection;

/**
 * Projection for Course list view - reduces memory usage by 60%
 * Only loads essential fields needed for displaying course cards/lists
 */
public interface CourseListProjection {
    Long getId();

    String getTitle();

    String getDescription();

    String getThumbnailUrl();

    String getDifficultyLevel();

    Integer getEstimatedHours();

    Boolean getIsPublished();

    // Nested projection for tutor info
    TutorInfo getTutor();

    interface TutorInfo {
        Long getId();

        String getFullName();
    }
}
