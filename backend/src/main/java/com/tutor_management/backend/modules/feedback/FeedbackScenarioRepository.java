package com.tutor_management.backend.modules.feedback;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Data access layer for {@link FeedbackScenario} templates.
 * Provides sophisticated querying for the Smart Generator engine.
 */
@Repository
public interface FeedbackScenarioRepository extends JpaRepository<FeedbackScenario, Long> {

    List<FeedbackScenario> findByCategory(String category);

    List<FeedbackScenario> findByCategoryAndRatingLevel(String category, String ratingLevel);

    List<FeedbackScenario> findByKeyword(String keyword);

    /**
     * Finds scenarios matching specific criteria. Supports 'ANY' as a fallback for rating level.
     */
    @Query("SELECT fs FROM FeedbackScenario fs " +
            "WHERE fs.category = :category " +
            "AND (:ratingLevel IS NULL OR fs.ratingLevel = :ratingLevel OR fs.ratingLevel = 'ANY') " +
            "AND (:keyword IS NULL OR fs.keyword LIKE %:keyword%)")
    List<FeedbackScenario> findScenarios(@Param("category") String category,
                    @Param("ratingLevel") String ratingLevel,
                    @Param("keyword") String keyword);

    /**
     * Extracts distinct keywords used within a specific category and rating tier.
     */
    @Query("SELECT DISTINCT fs.keyword FROM FeedbackScenario fs " +
            "WHERE fs.category = :category " +
            "AND (:ratingLevel IS NULL OR fs.ratingLevel = :ratingLevel OR fs.ratingLevel = 'ANY')")
    List<String> findKeywordsByCategoryAndRating(@Param("category") String category,
                    @Param("ratingLevel") String ratingLevel);

    long countByCategory(String category);

    long countByRatingLevel(String ratingLevel);

    boolean existsByCategory(String category);

    /**
     * Comprehensive filter for scenario retrieval.
     */
    @Query("SELECT f FROM FeedbackScenario f " +
            "WHERE f.category = :category " +
            "AND (:ratingLevel IS NULL OR f.ratingLevel = :ratingLevel OR f.ratingLevel = 'ANY') " +
            "AND (:keyword IS NULL OR f.keyword = :keyword)")
    List<FeedbackScenario> findAllByCriteria(
                    @Param("category") String category,
                    @Param("ratingLevel") String ratingLevel,
                    @Param("keyword") String keyword);

    /**
     * Retrieves a single random scenario matching the author's criteria. 
     * Uses native SQL for performance.
     */
    @Query(value = "SELECT * FROM feedback_scenarios " +
                    "WHERE category = :category " +
                    "AND (rating_level = :ratingLevel OR rating_level = 'ANY' OR rating_level IS NULL OR :ratingLevel IS NULL) "
                    +
                    "AND (keyword = :keyword OR keyword IS NULL OR :keyword IS NULL) " +
                    "ORDER BY RAND() LIMIT 1", nativeQuery = true)
    FeedbackScenario findRandomByCriteria(
                    @Param("category") String category,
                    @Param("ratingLevel") String ratingLevel,
                    @Param("keyword") String keyword);
}