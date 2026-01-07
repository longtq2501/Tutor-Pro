// =========================================================================
// FILE 4: DocumentRepository.java
// Location: src/main/java/com/tutor_management/backend/repository/
// =========================================================================

package com.tutor_management.backend.modules.document;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

        // ✅ OPTIMIZED: Fetch với student nếu có
        // ✅ OPTIMIZED: Fetch với student và category để tránh N+1
        @Query("SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category")
        List<Document> findAllWithStudent();

        @Query(value = "SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category",
               countQuery = "SELECT COUNT(d) FROM Document d")
        org.springframework.data.domain.Page<Document> findAllWithStudent(org.springframework.data.domain.Pageable pageable);

        @Query("SELECT d FROM Document d " +
                        "LEFT JOIN FETCH d.student " +
                        "LEFT JOIN FETCH d.category " +
                        "WHERE d.categoryType = :categoryType " +
                        "ORDER BY d.createdAt DESC")
        List<Document> findByCategoryTypeOrderByCreatedAtDesc(@Param("categoryType") DocumentCategoryType categoryType);

        @Query(value = "SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category WHERE d.categoryType = :categoryType",
               countQuery = "SELECT COUNT(d) FROM Document d WHERE d.categoryType = :categoryType")
        org.springframework.data.domain.Page<Document> findByCategoryType(@Param("categoryType") DocumentCategoryType categoryType, org.springframework.data.domain.Pageable pageable);

        @Query("SELECT d FROM Document d " +
                        "LEFT JOIN FETCH d.student " +
                        "LEFT JOIN FETCH d.category " +
                        "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "ORDER BY d.createdAt DESC")
        List<Document> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(@Param("keyword") String keyword);

        // Stats queries - không cần join
        @Query("SELECT COUNT(d) FROM Document d WHERE d.categoryType = :categoryType")
        Long countByCategoryType(@Param("categoryType") DocumentCategoryType categoryType);

        @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d")
        Long sumTotalFileSize();

        @Query("SELECT COALESCE(SUM(d.downloadCount), 0) FROM Document d")
        Long sumTotalDownloads();

        // ✅ OPTIMIZED: Count docs for specific student OR public docs (student is null)
        @Query("SELECT COUNT(d) FROM Document d WHERE d.student.id = :studentId OR d.student IS NULL")
        Long countByStudentIdOrStudentIsNull(@Param("studentId") Long studentId);

        // ✅ OPTIMIZED: Aggregated stats queries (GROUP BY included)
        @Query("SELECT d.categoryType, COUNT(d) FROM Document d GROUP BY d.categoryType")
        List<Object[]> countDocumentsByCategoryType();

        @Query("SELECT COUNT(d), COALESCE(SUM(d.fileSize), 0), COALESCE(SUM(d.downloadCount), 0) FROM Document d")
        Object getAggregatedStats();
}
