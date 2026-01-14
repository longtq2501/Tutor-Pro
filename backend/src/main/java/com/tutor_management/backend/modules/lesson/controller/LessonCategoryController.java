package com.tutor_management.backend.modules.lesson.controller;

import com.tutor_management.backend.modules.lesson.entity.LessonCategory;
import com.tutor_management.backend.modules.lesson.service.LessonCategoryService;
import com.tutor_management.backend.modules.lesson.dto.request.LessonCategoryRequest;
import com.tutor_management.backend.modules.lesson.dto.response.LessonCategoryResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for {@link LessonCategory} taxonomy management.
 * Authorized for: ADMIN, TUTOR.
 */
@RestController
@RequestMapping("/api/lesson-categories")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class LessonCategoryController {

    private final LessonCategoryService categoryService;

    /**
     * Lists all lesson categories.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonCategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    /**
     * Retrieves details for a specific category.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id)));
    }

    /**
     * Creates a new lesson category.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> createCategory(
            @Valid @RequestBody LessonCategoryRequest request) {
        log.info("Creating lesson category: {}", request.getName());
        return ResponseEntity.ok(ApiResponse.success("Đã tạo danh mục thành công", categoryService.createCategory(request)));
    }

    /**
     * Updates an existing category configuration.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody LessonCategoryRequest request) {
        log.info("Updating lesson category ID: {}", id);
        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật danh mục thành công", categoryService.updateCategory(id, request)));
    }

    /**
     * Deletes a category record.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        log.warn("Deleting lesson category ID: {}", id);
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa danh mục thành công", null));
    }
}
