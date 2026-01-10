package com.tutor_management.backend.modules.document;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
