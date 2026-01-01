package com.tutor_management.backend.modules.feedback;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FeedbackScenarioRepository extends JpaRepository<FeedbackScenario, Long> {

    List<FeedbackScenario> findByCategoryAndRatingLevel(String category, String ratingLevel);

    @Query("SELECT fs FROM FeedbackScenario fs " +
            "WHERE fs.category = :category " +
            "AND fs.ratingLevel = :ratingLevel " +
            "AND (:keyword IS NULL OR fs.keyword LIKE %:keyword%)")
    List<FeedbackScenario> findScenarios(@Param("category") String category,
            @Param("ratingLevel") String ratingLevel,
            @Param("keyword") String keyword);

    @Query("SELECT DISTINCT fs.keyword FROM FeedbackScenario fs WHERE fs.category = :category AND fs.ratingLevel = :ratingLevel")
    List<String> findKeywordsByCategoryAndRating(@Param("category") String category,
            @Param("ratingLevel") String ratingLevel);
}
