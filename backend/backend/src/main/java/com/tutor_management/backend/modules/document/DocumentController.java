package com.tutor_management.backend.modules.document;

import com.tutor_management.backend.modules.document.dto.request.DocumentRequest;
import com.tutor_management.backend.modules.document.dto.response.DocumentResponse;
import com.tutor_management.backend.modules.document.dto.response.DocumentStats;
import com.tutor_management.backend.modules.document.dto.response.DocumentUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<DocumentResponse>> getAllDocuments(
            org.springframework.data.domain.Pageable pageable
    ) {
        return ResponseEntity.ok(documentService.getAllDocuments(pageable));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/category/{category}")
    public ResponseEntity<org.springframework.data.domain.Page<DocumentResponse>> getDocumentsByCategory(
            @PathVariable DocumentCategoryType category,
            org.springframework.data.domain.Pageable pageable
    ) {
        return ResponseEntity.ok(documentService.getDocumentsByCategory(category, pageable));
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

    /**
     * Download endpoint - Returns Cloudinary URL and increments download count
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable Long id) {
        try {
            System.out.println("📥 Download request for document ID: " + id);

            DocumentResponse document = documentService.getDocumentById(id);
            String fileUrl = documentService.getDocumentUrl(id);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "url", fileUrl,
                            "fileName", document.getFileName(),
                            "fileType", document.getFileType()
                    ));

        } catch (Exception e) {
            System.err.println("❌ Download error: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Preview endpoint - Returns Cloudinary URL without incrementing download count
     */
    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}/preview")
    public ResponseEntity<?> previewDocument(@PathVariable Long id) {
        try {
            System.out.println("👁️ Preview request for document ID: " + id);

            DocumentResponse document = documentService.getDocumentById(id);
            String fileUrl = documentService.getPreviewUrl(id);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "url", fileUrl,
                            "fileName", document.getFileName(),
                            "fileType", document.getFileType(),
                            "fileSize", document.getFileSize()
                    ));

        } catch (Exception e) {
            System.err.println("❌ Preview error: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
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

    @PreAuthorize("permitAll()")
    @GetMapping("/categories")
    public ResponseEntity<DocumentCategoryType[]> getCategories() {
        return ResponseEntity.ok(DocumentCategoryType.values());
    }
}
