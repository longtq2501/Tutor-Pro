package com.tutor_management.backend.modules.lesson;

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

@RestController
@RequestMapping("/api/admin/lesson-categories")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
public class LessonCategoryController {

    private final LessonCategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LessonCategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> createCategory(
            @Valid @RequestBody LessonCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Đã tạo danh mục", categoryService.createCategory(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LessonCategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody LessonCategoryRequest request) {
        return ResponseEntity
                .ok(ApiResponse.success("Đã cập nhật danh mục", categoryService.updateCategory(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa danh mục", null));
    }
}
