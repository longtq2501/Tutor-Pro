// =========================================================================
// FILE 4: DocumentRepository.java
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Document;
import com.tutor_management.backend.entity.DocumentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // ✅ OPTIMIZED: Fetch với student nếu có
    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.student ORDER BY d.createdAt DESC")
    List<Document> findAllByOrderByCreatedAtDesc();

    @Query("SELECT d FROM Document d " +
            "LEFT JOIN FETCH d.student " +
            "WHERE d.category = :category " +
            "ORDER BY d.createdAt DESC")
    List<Document> findByCategoryOrderByCreatedAtDesc(@Param("category") DocumentCategory category);

    @Query("SELECT d FROM Document d " +
            "LEFT JOIN FETCH d.student s " +
            "WHERE s.id = :studentId " +
            "ORDER BY d.createdAt DESC")
    List<Document> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);

    @Query("SELECT d FROM Document d " +
            "LEFT JOIN FETCH d.student " +
            "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY d.createdAt DESC")
    List<Document> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(@Param("keyword") String keyword);

    // ✅ ADD: Get by ID with student
    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.student WHERE d.id = :id")
    Optional<Document> findByIdWithStudent(@Param("id") Long id);

    // Stats queries - không cần join
    @Query("SELECT COUNT(d) FROM Document d WHERE d.category = :category")
    Long countByCategory(@Param("category") DocumentCategory category);

    @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d")
    Long sumTotalFileSize();

    @Query("SELECT COALESCE(SUM(d.downloadCount), 0) FROM Document d")
    Long sumTotalDownloads();
}