package com.tutor_management.backend.repository;

import com.tutor_management.backend.entity.Document;
import com.tutor_management.backend.entity.DocumentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findAllByOrderByCreatedAtDesc();

    List<Document> findByCategoryOrderByCreatedAtDesc(DocumentCategory category);

    List<Document> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Document> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);

    @Query("SELECT COUNT(d) FROM Document d WHERE d.category = :category")
    Long countByCategory(DocumentCategory category);

    @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d")
    Long sumTotalFileSize();

    @Query("SELECT COALESCE(SUM(d.downloadCount), 0) FROM Document d")
    Long sumTotalDownloads();
}