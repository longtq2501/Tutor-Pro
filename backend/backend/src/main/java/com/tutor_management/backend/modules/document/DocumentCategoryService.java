package com.tutor_management.backend.modules.document;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentCategoryService {

    private final DocumentCategoryRepository categoryRepository;

    public List<DocumentCategory> getAllActiveCategories() {
        return categoryRepository.findAllByActiveTrueOrderByDisplayOrderAsc();
    }

    public DocumentCategory createCategory(DocumentCategory category) {
        if (categoryRepository.findByCode(category.getCode()).isPresent()) {
            throw new RuntimeException("Category code already exists: " + category.getCode());
        }
        return categoryRepository.save(category);
    }
    
    public DocumentCategory updateCategory(Long id, DocumentCategory categoryDetails) {
        DocumentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Update fields
        category.setName(categoryDetails.getName());
        category.setCode(categoryDetails.getCode()); // Allow code update? Be careful with duplicates
        category.setDescription(categoryDetails.getDescription());
        category.setDisplayOrder(categoryDetails.getDisplayOrder());
        category.setActive(categoryDetails.getActive());
        
        // Validate code uniqueness if changed
        if (!category.getCode().equals(categoryDetails.getCode()) && 
            categoryRepository.findByCode(categoryDetails.getCode()).isPresent()) {
             throw new RuntimeException("Category code already exists: " + categoryDetails.getCode());
        }

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        DocumentCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        try {
            categoryRepository.delete(category);
        } catch (Exception e) {
             throw new RuntimeException("Cannot delete category. It may contain documents.");
        }
    }
}
