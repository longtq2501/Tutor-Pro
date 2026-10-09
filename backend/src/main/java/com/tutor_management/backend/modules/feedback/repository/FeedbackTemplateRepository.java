package com.tutor_management.backend.modules.feedback.repository;

import com.tutor_management.backend.modules.feedback.entity.FeedbackTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackTemplateRepository extends JpaRepository<FeedbackTemplate, Long> {

    @Query("SELECT ft FROM FeedbackTemplate ft WHERE (ft.user.id = :userId OR ft.isSystem = true) " +
           "AND (:category IS NULL OR ft.category = :category OR ft.category = 'GENERAL') " +
           "ORDER BY ft.isSystem ASC, ft.updatedAt DESC")
    List<FeedbackTemplate> findAccessibleTemplates(
            @Param("userId") Long userId,
            @Param("category") String category
    );

    @Query("SELECT ft FROM FeedbackTemplate ft WHERE ft.isSystem = true " +
           "AND (:category IS NULL OR ft.category = :category OR ft.category = 'GENERAL') " +
           "ORDER BY ft.id ASC")
    List<FeedbackTemplate> findSystemTemplates(@Param("category") String category);

    long countByIsSystemTrue();
}
