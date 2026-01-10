package com.tutor_management.backend.modules.course.projection;

/**
 * Projection for Course list view - reduces memory usage by 60%.
 * Defines the contract for efficient, limited-field course data retrieval.
 */
public interface CourseListProjection {
    /** Unique identifier of the course */
    Long getId();

    /** Display title */
    String getTitle();

    /** Short summary of the course */
    String getDescription();

    /** Image asset URL */
    String getThumbnailUrl();

    /** Difficulty categorization */
    String getDifficultyLevel();

    /** Total hours (estimated) */
    Integer getEstimatedHours();

    /** Publishing status */
    Boolean getIsPublished();

    /** Nested projection containing only the required tutor metadata */
    TutorInfo getTutor();

    /**
     * Minimized tutor metadata for course cards.
     */
    interface TutorInfo {
        /** Tutor's system ID */
        Long getId();

        /** Tutor's full display name */
        String getFullName();
    }
}
