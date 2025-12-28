package com.tutor_management.backend.modules.lesson;

import com.tutor_management.backend.modules.lesson.dto.request.LessonCategoryRequest;
import com.tutor_management.backend.modules.lesson.dto.response.LessonCategoryResponse;
import com.tutor_management.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonCategoryService {

    private final LessonCategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<LessonCategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LessonCategoryResponse getCategoryById(Long id) {
        LessonCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));
        return mapToResponse(category);
    }

    @Transactional
    public LessonCategoryResponse createCategory(LessonCategoryRequest request) {
        LessonCategory category = LessonCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .color(request.getColor())
                .icon(request.getIcon())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public LessonCategoryResponse updateCategory(Long id, LessonCategoryRequest request) {
        LessonCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setColor(request.getColor());
        category.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy danh mục với id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private LessonCategoryResponse mapToResponse(LessonCategory category) {
        return LessonCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .color(category.getColor())
                .icon(category.getIcon())
                .displayOrder(category.getDisplayOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
