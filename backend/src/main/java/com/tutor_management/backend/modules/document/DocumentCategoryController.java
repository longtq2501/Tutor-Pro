package com.tutor_management.backend.modules.document;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/document-categories")
@RequiredArgsConstructor
public class DocumentCategoryController {

    private final DocumentCategoryService categoryService;

    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<List<DocumentCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllActiveCategories());
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<DocumentCategory> createCategory(@org.springframework.web.bind.annotation.RequestBody DocumentCategory category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<DocumentCategory> updateCategory(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody DocumentCategory category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@org.springframework.web.bind.annotation.PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok().build();
    }
}
