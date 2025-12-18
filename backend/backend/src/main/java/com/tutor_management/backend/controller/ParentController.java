package com.tutor_management.backend.controller;

import com.tutor_management.backend.dto.request.ParentRequest;
import com.tutor_management.backend.dto.response.ParentResponse;
//import com.tutor_management.backend.entity.Parent;
import com.tutor_management.backend.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parents")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class ParentController {

    private final ParentService parentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping
    public ResponseEntity<List<ParentResponse>> getAllParents() {
        List<ParentResponse> parents = parentService.getAllParents();
        return ResponseEntity.ok(parents);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/{id}")
    public ResponseEntity<ParentResponse> getParentById(@PathVariable Long id) {
        ParentResponse parent = parentService.getParentById(id);
        return ResponseEntity.ok(parent);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping
    public ResponseEntity<ParentResponse> createParent(@RequestBody ParentRequest request) {
        ParentResponse parent = parentService.createParent(request);
        return ResponseEntity.ok(parent);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ParentResponse> updateParent(
            @PathVariable Long id,
            @RequestBody ParentRequest request
    ) {
        ParentResponse parent = parentService.updateParent(id, request);
        return ResponseEntity.ok(parent);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParent(@PathVariable Long id) {
        parentService.deleteParent(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/search")
    public ResponseEntity<List<ParentResponse>> searchParents(@RequestParam String keyword) {
        List<ParentResponse> parents = parentService.searchParents(keyword);
        return ResponseEntity.ok(parents);
    }
}