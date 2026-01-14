package com.tutor_management.backend.modules.document.controller;

import com.tutor_management.backend.modules.document.service.DocumentCategoryService;
import com.tutor_management.backend.modules.document.entity.DocumentCategory;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing dynamic document categories.
 */
@RestController
@RequestMapping("/api/document-categories")
@RequiredArgsConstructor
public class DocumentCategoryController {

    private final DocumentCategoryService categoryService;

    /**
     * Lists all active categories for the document library.
     */
    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentCategory>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllActiveCategories()));
    }

    /**
     * Creates a new classification category.
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<DocumentCategory>> createCategory(@RequestBody DocumentCategory category) {
        DocumentCategory saved = categoryService.createCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Tạo danh mục thành công", saved));
    }

    /**
     * Updates an existing category's metadata (name, code, style).
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DocumentCategory>> updateCategory(
            @PathVariable Long id,
            @RequestBody DocumentCategory category) {
        DocumentCategory updated = categoryService.updateCategory(id, category);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật danh mục thành công", updated));
    }

    /**
     * Deletes a category and detaches its documents.
     */
    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa danh mục thành công", null));
    }
}
