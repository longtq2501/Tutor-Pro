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
                        "WHERE d.category.code = :categoryCode " +
                        "ORDER BY d.createdAt DESC")
        List<Document> findByCategoryCodeOrderByCreatedAtDesc(@Param("categoryCode") String categoryCode);

        @Query(value = "SELECT d FROM Document d LEFT JOIN FETCH d.student LEFT JOIN FETCH d.category WHERE d.category.code = :categoryCode",
               countQuery = "SELECT COUNT(d) FROM Document d JOIN d.category c WHERE c.code = :categoryCode")
        org.springframework.data.domain.Page<Document> findByCategoryCode(@Param("categoryCode") String categoryCode, org.springframework.data.domain.Pageable pageable);

        @Query("SELECT d FROM Document d " +
                        "LEFT JOIN FETCH d.student " +
                        "LEFT JOIN FETCH d.category " +
                        "WHERE LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                        "ORDER BY d.createdAt DESC")
        List<Document> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(@Param("keyword") String keyword);

        // Stats queries - không cần join
        @Query("SELECT COUNT(d) FROM Document d WHERE d.category.code = :categoryCode")
        Long countByCategoryCode(@Param("categoryCode") String categoryCode);

        @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d")
        Long sumTotalFileSize();

        @Query("SELECT COALESCE(SUM(d.downloadCount), 0) FROM Document d")
        Long sumTotalDownloads();

        // ✅ OPTIMIZED: Count docs for specific student OR public docs (student is null)
        @Query("SELECT COUNT(d) FROM Document d WHERE d.student.id = :studentId OR d.student IS NULL")
        Long countByStudentIdOrStudentIsNull(@Param("studentId") Long studentId);

        // ✅ OPTIMIZED: Aggregated stats queries (GROUP BY included)
        @Query("SELECT c.code, COUNT(d) FROM Document d JOIN d.category c GROUP BY c.code")
        List<Object[]> countDocumentsByCategoryCode();

        @org.springframework.data.jpa.repository.Modifying
        @org.springframework.data.jpa.repository.Query("UPDATE Document d SET d.category = null WHERE d.category.id = :categoryId")
        void clearCategoryReferences(@Param("categoryId") Long categoryId);

        @Query("SELECT COUNT(d), COALESCE(SUM(d.fileSize), 0), COALESCE(SUM(d.downloadCount), 0) FROM Document d")
        Object getAggregatedStats();
}
