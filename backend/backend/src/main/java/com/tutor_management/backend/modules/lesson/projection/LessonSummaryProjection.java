package com.tutor_management.backend.modules.lesson.projection;

import java.time.LocalDate;

/**
 * Projection for Lesson summary/list view - reduces memory usage by 70-80%
 * Only loads fields needed for displaying lesson cards in library
 * Avoids loading heavy fields like content, images, resources, assignments
 */
public interface LessonSummaryProjection {
    Long getId();

    String getTitle();

    String getSummary();

    String getThumbnailUrl();

    String getDifficultyLevel();

    Integer getDurationMinutes();

    LocalDate getLessonDate();

    Boolean getIsPublished();

    String getVideoUrl();

    // Nested projection for category
    CategoryInfo getCategory();

    interface CategoryInfo {
        Long getId();

        String getName();

        String getDescription();
    }

    // Basic metrics
    Integer getPoints();

    Integer getPassScore();

    Double getAverageRating();

    Integer getReviewCount();
}
