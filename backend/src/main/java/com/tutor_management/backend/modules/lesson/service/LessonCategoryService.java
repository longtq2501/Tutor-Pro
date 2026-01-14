package com.tutor_management.backend.modules.lesson.service;

import com.tutor_management.backend.modules.lesson.entity.LessonCategory;
import com.tutor_management.backend.modules.lesson.repository.LessonCategoryRepository;
import com.tutor_management.backend.modules.lesson.dto.request.LessonCategoryRequest;
import com.tutor_management.backend.modules.lesson.dto.response.LessonCategoryResponse;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing {@link LessonCategory} taxonomy.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class LessonCategoryService {

    private final LessonCategoryRepository categoryRepository;

    /**
     * Lists all available lesson categories.
     */
    @Transactional(readOnly = true)
    public List<LessonCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(LessonCategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves category details by ID.
     */
    @Transactional(readOnly = true)
    public LessonCategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(LessonCategoryResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
    }

    /**
     * Creates a new lesson category.
     */
    public LessonCategoryResponse createCategory(LessonCategoryRequest request) {
        LessonCategory category = LessonCategory.builder()
                .name(request.getName()).description(request.getDescription())
                .color(request.getColor()).icon(request.getIcon())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        return LessonCategoryResponse.fromEntity(categoryRepository.save(category));
    }

    /**
     * Updates an existing category configuration.
     */
    public LessonCategoryResponse updateCategory(Long id, LessonCategoryRequest request) {
        LessonCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null) category.setDisplayOrder(request.getDisplayOrder());

        return LessonCategoryResponse.fromEntity(categoryRepository.save(category));
    }

    /**
     * Deletes a category record.
     */
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}
