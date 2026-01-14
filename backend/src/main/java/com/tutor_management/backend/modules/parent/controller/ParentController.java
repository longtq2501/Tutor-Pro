package com.tutor_management.backend.modules.parent.controller;

import com.tutor_management.backend.modules.parent.service.ParentService;
import com.tutor_management.backend.modules.parent.dto.request.ParentRequest;
import com.tutor_management.backend.modules.parent.dto.response.ParentResponse;
import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RESTful interface for managing parent and guardian records.
 * Access is restricted to administrative staff and tutors.
 */
@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
@Slf4j
public class ParentController {

    private final ParentService parentService;

    /**
     * Fetches the complete registry of parents.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParentResponse>>> getAllParents() {
        return ResponseEntity.ok(ApiResponse.success(parentService.getAllParents()));
    }

    /**
     * Fetches a single parent's detailed record.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParentResponse>> getParentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(parentService.getParentById(id)));
    }

    /**
     * Creates a new parent entry.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<ParentResponse>> createParent(@Valid @RequestBody ParentRequest request) {
        ParentResponse parent = parentService.createParent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới phụ huynh thành công", parent));
    }

    /**
     * Partially updates an existing parent record.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ParentResponse>> updateParent(
            @PathVariable Long id,
            @Valid @RequestBody ParentRequest request
    ) {
        ParentResponse parent = parentService.updateParent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thông tin phụ huynh thành công", parent));
    }

    /**
     * Destructive removal of a parent record.
     * Note: Access limited to ADMIN roles only.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phụ huynh thành công", null));
    }

    /**
     * Searches for parents based on keyword filters.
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ParentResponse>>> searchParents(@RequestParam String keyword) {
        return ResponseEntity.ok(ApiResponse.success(parentService.searchParents(keyword)));
    }
}
