package com.tutor_management.backend.modules.document.repository;

import com.tutor_management.backend.modules.document.entity.DocumentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link DocumentCategory} entities.
 */
@Repository
public interface DocumentCategoryRepository extends JpaRepository<DocumentCategory, Long> {
    
    /**
     * Finds a category by its unique identifier code.
     * 
     * @param code The unique category code (e.g., "VOCAB")
     * @return Optional containing the category if found
     */
    Optional<DocumentCategory> findByCode(String code);

    /**
     * Retrieves all active categories, sorted for UI menu display.
     */
    List<DocumentCategory> findAllByActiveTrueOrderByDisplayOrderAsc();

    /**
     * Cursor-based query for categories.
     * Uses displayOrder and id as the cursor to ensure unique, stable paging.
     */
    @org.springframework.data.jpa.repository.Query("SELECT c FROM DocumentCategory c " +
            "WHERE c.active = true " +
            "AND (:lastDisplayOrder IS NULL OR c.displayOrder > :lastDisplayOrder OR (c.displayOrder = :lastDisplayOrder AND c.id > :lastId)) " +
            "ORDER BY c.displayOrder ASC, c.id ASC")
    List<DocumentCategory> findCategoriesByCursor(
            @org.springframework.data.repository.query.Param("lastDisplayOrder") Integer lastDisplayOrder,
            @org.springframework.data.repository.query.Param("lastId") Long lastId,
            org.springframework.data.domain.Pageable pageable);
}
