package com.tutor_management.backend.controller;

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

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
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
                        buildContentDisposition("attachment", document.getFileName()))
                .body(resource);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TUTOR', 'STUDENT')")
    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewDocument(@PathVariable Long id) {
        DocumentResponse document = documentService.getDocumentById(id);
        Resource resource = documentService.previewDocument(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        buildContentDisposition("inline", document.getFileName()))
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

    @PreAuthorize("permitAll()")
    @GetMapping("/categories")
    public ResponseEntity<DocumentCategory[]> getCategories() {
        return ResponseEntity.ok(DocumentCategory.values());
    }

    /**
     * Build Content-Disposition header with proper filename encoding
     * Supports both ASCII and Unicode filenames (RFC 5987)
     */
    private String buildContentDisposition(String disposition, String filename) {
        try {
            // Encode filename for UTF-8 (RFC 5987)
            String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8.toString())
                    .replaceAll("\\+", "%20"); // Replace + with %20 for spaces

            // Build header with both ASCII fallback and UTF-8 encoded filename
            return String.format(
                    "%s; filename=\"%s\"; filename*=UTF-8''%s",
                    disposition,
                    sanitizeFilenameForAscii(filename), // ASCII fallback
                    encodedFilename                      // UTF-8 encoded (modern browsers)
            );
        } catch (UnsupportedEncodingException e) {
            // Fallback to simple format if encoding fails
            return disposition + "; filename=\"" + sanitizeFilenameForAscii(filename) + "\"";
        }
    }

    /**
     * Sanitize filename to ASCII-safe characters (fallback for old browsers)
     */
    private String sanitizeFilenameForAscii(String filename) {
        return filename
                .replaceAll("[^\\x00-\\x7F]", "_")  // Replace non-ASCII with underscore
                .replaceAll("[\\s]+", "_")           // Replace spaces with underscore
                .replaceAll("[^a-zA-Z0-9._-]", "");  // Remove special chars
    }
}