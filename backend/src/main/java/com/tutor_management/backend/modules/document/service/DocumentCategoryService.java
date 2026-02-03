package com.tutor_management.backend.modules.document.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.document.repository.DocumentCategoryRepository;
import com.tutor_management.backend.modules.document.repository.DocumentRepository;
import com.tutor_management.backend.modules.document.entity.DocumentCategory;
import com.tutor_management.backend.modules.shared.dto.response.CursorPageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for configuring and managing document categories.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DocumentCategoryService {

    private final DocumentCategoryRepository categoryRepository;
    private final DocumentRepository documentRepository;

    /**
     * Lists all categories available for document classification using cursor-based pagination.
     */
    @Transactional(readOnly = true)
    public CursorPageResponse<DocumentCategory> getCategoriesCursor(String cursor, int limit) {
        Integer lastDisplayOrder = null;
        Long lastId = null;

        if (cursor != null && !cursor.isBlank()) {
            try {
                String[] parts = cursor.split(":");
                if (parts.length == 2) {
                    lastDisplayOrder = Integer.parseInt(parts[0]);
                    lastId = Long.parseLong(parts[1]);
                }
            } catch (Exception e) {
                log.warn("Invalid cursor format: {}", cursor);
            }
        }

        // Fetch limit + 1 to determine hasNext
        Pageable pageable = PageRequest.of(0, limit + 1);
        List<DocumentCategory> items = categoryRepository.findCategoriesByCursor(lastDisplayOrder, lastId, pageable);

        boolean hasNext = items.size() > limit;
        if (hasNext) {
            items = items.subList(0, limit);
        }

        String nextCursor = null;
        if (hasNext && !items.isEmpty()) {
            DocumentCategory lastItem = items.get(items.size() - 1);
            nextCursor = lastItem.getDisplayOrder() + ":" + lastItem.getId();
        }

        return CursorPageResponse.<DocumentCategory>builder()
                .items(items)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .build();
    }

    /**
     * Lists all categories available for document classification.
     */
    @Transactional(readOnly = true)
    public List<DocumentCategory> getAllActiveCategories() {
        return categoryRepository.findAllByActiveTrueOrderByDisplayOrderAsc();
    }

    /**
     * Registers a new document category.
     * 
     * @param category The category template to save
     * @throws IllegalArgumentException if the category code is already in use
     */
    public DocumentCategory createCategory(DocumentCategory category) {
        if (categoryRepository.findByCode(category.getCode()).isPresent()) {
            throw new IllegalArgumentException("Category code already exists: " + category.getCode());
        }
        log.info("Creating new document category: {}", category.getCode());
        return categoryRepository.save(category);
    }
    
    /**
     * Updates metadata for an existing category.
     */
    public DocumentCategory updateCategory(Long id, DocumentCategory categoryDetails) {
        DocumentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        validateCodeUniqueness(category.getCode(), categoryDetails.getCode());

        category.setName(categoryDetails.getName());
        category.setCode(categoryDetails.getCode());
        category.setDescription(categoryDetails.getDescription());
        category.setDisplayOrder(categoryDetails.getDisplayOrder());
        category.setActive(categoryDetails.getActive());
        category.setColor(categoryDetails.getColor());
        category.setIcon(categoryDetails.getIcon());
        
        return categoryRepository.save(category);
    }

    private void validateCodeUniqueness(String currentCode, String nextCode) {
        if (!currentCode.equalsIgnoreCase(nextCode) && 
            categoryRepository.findByCode(nextCode).isPresent()) {
             throw new IllegalArgumentException("Category code already exists: " + nextCode);
        }
    }

    /**
     * Permanently removes a category after detaching all associated documents.
     */
    public void deleteCategory(Long id) {
        DocumentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        
        log.info("Deleting document category: {}", category.getCode());
        documentRepository.clearCategoryReferences(id);
        categoryRepository.delete(category);
    }
}
