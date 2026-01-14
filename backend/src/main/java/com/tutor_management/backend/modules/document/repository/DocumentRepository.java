package com.tutor_management.backend.modules.document.repository;

import java.util.List;

import com.tutor_management.backend.modules.document.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for {@link Document} management.
 * Provides optimized queries with JOIN FETCH to eliminate N+1 issues when loading student and category metadata.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /**
     * Retrieves all documents with their associated student and category pre-fetched.
     * Prevents lazy loading issues when rendering document lists with owner names and category tags.
     */
    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category")
    List<Document> findAllWithStudent();

    /**
     * Paged version of {@link #findAllWithStudent()}.
     * Includes a custom count query to maintain performance on large datasets.
     */
    @Query(value = "SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category",
           countQuery = "SELECT COUNT(d) FROM Document d")
    Page<Document> findAllWithStudent(Pageable pageable);

    /**
     * Finds documents belonging to a specific category code, sorted by creation date.
     * Pre-fetches student and category details for UI rendering.
     */
    @Query("SELECT d FROM Document d " +
            "LEFT JOIN FETCH d.student " +
            "LEFT JOIN FETCH d.category " +
            "WHERE d.category.code = :categoryCode " +
            "ORDER BY d.createdAt DESC")
    List<Document> findByCategoryCodeOrderByCreatedAtDesc(@Param("categoryCode") String categoryCode);

    /**
     * Paged version of document retrieval by category code.
     */
    @Query(value = "SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category WHERE d.category.code = :categoryCode",
           countQuery = "SELECT COUNT(d) FROM Document d JOIN d.category c WHERE c.code = :categoryCode")
    Page<Document> findByCategoryCode(@Param("categoryCode") String categoryCode, Pageable pageable);

    /**
     * Performs a case-insensitive search on document titles.
     * Includes metadata pre-fetching for the search result list.
     */
    @Query("SELECT d FROM Document d " +
            "LEFT JOIN FETCH d.student " +
            "LEFT JOIN FETCH d.category " +
            "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY d.createdAt DESC")
    List<Document> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(@Param("keyword") String keyword);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.category.code = :categoryCode")
    Long countByCategoryCode(@Param("categoryCode") String categoryCode);

    /**
     * Calculates the total storage footprint of all documents in the system.
     */
    @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d")
    Long sumTotalFileSize();

    /**
     * Aggregates the total number of downloads across all resources.
     */
    @Query("SELECT COALESCE(SUM(d.downloadCount), 0) FROM Document d")
    Long sumTotalDownloads();

    /**
     * Counts documents accessible to a specific student (private docs + public docs).
     */
    @Query("SELECT COUNT(d) FROM Document d WHERE d.student.id = :studentId OR d.student IS NULL")
    Long countByStudentIdOrStudentIsNull(@Param("studentId") Long studentId);

    /**
     * Groups document counts by category code for analytical dashboards.
     */
    @Query("SELECT c.code, COUNT(d) FROM Document d JOIN d.category c GROUP BY c.code")
    List<Object[]> countDocumentsByCategoryCode();

    /**
     * Detaches all documents from a category before the category is deleted or deactivated.
     */
    @Modifying
    @Query("UPDATE Document d SET d.category = null WHERE d.category.id = :categoryId")
    void clearCategoryReferences(@Param("categoryId") Long categoryId);

    /**
     * Retrieves high-level totals (count, size, downloads) in a single optimized aggregate query.
     */
    @Query("SELECT COUNT(d), COALESCE(SUM(d.fileSize), 0), COALESCE(SUM(d.downloadCount), 0) FROM Document d")
    Object getAggregatedStats();
}
