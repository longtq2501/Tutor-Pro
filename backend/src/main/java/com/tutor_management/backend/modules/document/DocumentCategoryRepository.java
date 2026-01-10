package com.tutor_management.backend.modules.document;

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
}
