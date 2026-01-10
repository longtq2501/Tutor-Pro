package com.tutor_management.backend.modules.document;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.document.dto.request.DocumentRequest;
import com.tutor_management.backend.modules.document.dto.response.DocumentResponse;
import com.tutor_management.backend.modules.document.dto.response.DocumentStats;
import com.tutor_management.backend.modules.document.dto.response.DocumentUploadResponse;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.shared.CloudinaryService;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for managing file uploads, document library navigation, and storage statistics.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final DocumentCategoryRepository documentCategoryRepository;
    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final CloudinaryService cloudinaryService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    /**
     * Lists all documents with paged results for the admin library.
     */
    @Transactional(readOnly = true)
    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        return documentRepository.findAllWithStudent(pageable).map(this::convertToResponse);
    }

    /**
     * Lists all documents as a flat list.
     */
    @Transactional(readOnly = true)
    public List<DocumentResponse> getAllDocuments() {
        return documentRepository.findAllWithStudent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filters documents by category with paged results.
     */
    @Transactional(readOnly = true)
    public Page<DocumentResponse> getDocumentsByCategory(DocumentCategoryType category, Pageable pageable) {
        return documentRepository.findByCategoryCode(category.name(), pageable).map(this::convertToResponse);
    }

    /**
     * Filters documents by category as a flat list.
     */
    @Transactional(readOnly = true)
    public List<DocumentResponse> getDocumentsByCategory(DocumentCategoryType category) {
        return documentRepository.findByCategoryCodeOrderByCreatedAtDesc(category.name()).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Searches for documents by title (case-insensitive).
     */
    @Transactional(readOnly = true)
    public List<DocumentResponse> searchDocuments(String keyword) {
        return documentRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Validates and uploads a document to Cloudinary, then stores metadata in the database.
     * Clears statistical caches upon success.
     */
    @CacheEvict(value = "documentStats", allEntries = true)
    public DocumentUploadResponse uploadDocument(MultipartFile file, DocumentRequest request) {
        validateFileUpload(file);

        try {
            String cloudinaryUrl = cloudinaryService.uploadFile(file, "tutor-documents");
            
            Student student = null;
            if (request.getStudentId() != null) {
                student = studentRepository.findById(request.getStudentId()).orElse(null);
            }

            DocumentCategory category = documentCategoryRepository.findByCode(request.getCategory())
                    .orElseThrow(() -> new ResourceNotFoundException("Document category not found: " + request.getCategory()));

            Document document = Document.builder()
                    .title(request.getTitle())
                    .fileName(file.getOriginalFilename())
                    .filePath(cloudinaryUrl)
                    .fileSize(file.getSize())
                    .fileType(file.getContentType())
                    .category(category)
                    .description(request.getDescription())
                    .student(student)
                    .downloadCount(0L)
                    .build();

            Document saved = documentRepository.save(document);
            log.info("Document '{}' uploaded successfully with ID: {}", saved.getTitle(), saved.getId());

            return DocumentUploadResponse.builder()
                    .id(saved.getId())
                    .title(saved.getTitle())
                    .fileName(saved.getFileName())
                    .message("File uploaded successfully")
                    .build();

        } catch (Exception e) {
            log.error("Failed to upload document: {}", e.getMessage(), e);
            throw new RuntimeException("Could not complete document upload: " + e.getMessage());
        }
    }

    private void validateFileUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new IllegalArgumentException("Unsupported file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, TXT");
        }
    }

    /**
     * Retrieves a single document by ID.
     */
    @Transactional(readOnly = true)
    public DocumentResponse getDocumentById(Long id) {
        return documentRepository.findById(id)
                .map(this::convertToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
    }

    /**
     * Increments download count and returns the file access URL.
     */
    public String getDocumentUrl(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));

        document.setDownloadCount(document.getDownloadCount() + 1);
        documentRepository.save(document);

        return document.getFilePath();
    }

    /**
     * Returns the file access URL without incrementing statistics.
     */
    @Transactional(readOnly = true)
    public String getPreviewUrl(Long id) {
        return documentRepository.findById(id)
                .map(Document::getFilePath)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));
    }

    /**
     * Removes a document from the remote cloud storage and the local database.
     * Also detaches the document from any associated session records.
     */
    @CacheEvict(value = "documentStats", allEntries = true)
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found: " + id));

        try {
            cloudinaryService.deleteFile(document.getFilePath());
            sessionRecordRepository.deleteDocumentReferences(id);
            documentRepository.delete(document);
            log.info("Deleted document with ID: {}", id);
        } catch (Exception e) {
            log.error("Error deleting document {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete document: " + e.getMessage());
        }
    }

    /**
     * Generates a snapshot of document library usage stats.
     * Uses a single optimized database query for aggregated totals.
     */
    @Cacheable("documentStats")
    @Transactional(readOnly = true)
    public DocumentStats getStatistics() {
        Object[] aggregatedStats = (Object[]) documentRepository.getAggregatedStats();
        
        Long totalDocuments = (Long) aggregatedStats[0];
        Long totalSize = (Long) aggregatedStats[1];
        Long totalDownloads = (Long) aggregatedStats[2];

        Map<String, Long> statsMap = new HashMap<>();
        for (DocumentCategoryType type : DocumentCategoryType.values()) {
             statsMap.put(type.name(), 0L);
        }

        documentRepository.countDocumentsByCategoryCode().forEach(row -> {
             String code = (String) row[0];
             Long count = (Long) row[1];
             if (code != null) statsMap.put(code, count);
        });

        return DocumentStats.builder()
                .totalDocuments(totalDocuments)
                .totalSize(totalSize)
                .formattedTotalSize(formatFileSize(totalSize != null ? totalSize : 0))
                .totalDownloads(totalDownloads)
                .categoryStats(statsMap)
                .build();
    }

    private boolean isValidFileType(String contentType) {
        if (contentType == null) return false;
        return List.of(
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/plain"
        ).contains(contentType);
    }

    private DocumentResponse convertToResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .fileName(document.getFileName())
                .filePath(document.getFilePath())
                .fileSize(document.getFileSize())
                .fileType(document.getFileType())
                .category(determineCategoryType(document))
                .categoryDisplayName(document.getCategory() != null ? document.getCategory().getName() : "N/A")
                .categoryId(document.getCategory() != null ? document.getCategory().getId() : null)
                .categoryName(document.getCategory() != null ? document.getCategory().getName() : null)
                .studentId(document.getStudent() != null ? document.getStudent().getId() : null)
                .studentName(document.getStudent() != null ? document.getStudent().getName() : null)
                .downloadCount(document.getDownloadCount())
                .createdAt(document.getCreatedAt().format(formatter))
                .updatedAt(document.getUpdatedAt().format(formatter))
                .formattedFileSize(formatFileSize(document.getFileSize()))
                .build();
    }

    private DocumentCategoryType determineCategoryType(Document document) {
        if (document.getCategoryType() != null) return document.getCategoryType();
        if (document.getCategory() == null) return DocumentCategoryType.OTHER;
        
        try {
            return DocumentCategoryType.valueOf(document.getCategory().getCode());
        } catch (IllegalArgumentException e) {
            return DocumentCategoryType.OTHER;
        }
    }

    private String formatFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = {"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.2f %s", size / Math.pow(1024, digitGroups), units[digitGroups]);
    }
}
