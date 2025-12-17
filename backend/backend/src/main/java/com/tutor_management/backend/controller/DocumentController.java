package com.tutor_management.backend.controller;

//import com.tutor_management.backend.dto.*;
import com.tutor_management.backend.dto.request.DocumentRequest;
import com.tutor_management.backend.dto.response.DocumentResponse;
import com.tutor_management.backend.dto.response.DocumentStats;
import com.tutor_management.backend.dto.response.DocumentUploadResponse;
import com.tutor_management.backend.entity.DocumentCategory;
import com.tutor_management.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/category/{category}")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByCategory(
            @PathVariable DocumentCategory category
    ) {
        return ResponseEntity.ok(documentService.getDocumentsByCategory(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/search")
    public ResponseEntity<List<DocumentResponse>> searchDocuments(
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(documentService.searchDocuments(keyword));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocument(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentUploadResponse> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestPart("data") DocumentRequest request
    ) {
        return ResponseEntity.ok(documentService.uploadDocument(file, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        DocumentResponse document = documentService.getDocumentById(id);
        Resource resource = documentService.downloadDocument(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getFileName() + "\"")
                .body(resource);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDocument(@PathVariable Long id) {
        DocumentResponse document = documentService.getDocumentById(id);
        Resource resource = documentService.previewDocument(id);

        // For preview, use inline instead of attachment
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + document.getFileName() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .header(HttpHeaders.EXPIRES, "0")
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR')")
    @GetMapping("/stats")
    public ResponseEntity<DocumentStats> getStatistics() {
        return ResponseEntity.ok(documentService.getStatistics());
    }

    @PreAuthorize("permitAll()") // Categories can be viewed by anyone to populate dropdowns etc.
    @GetMapping("/categories")
    public ResponseEntity<DocumentCategory[]> getCategories() {
        return ResponseEntity.ok(DocumentCategory.values());
    }
}