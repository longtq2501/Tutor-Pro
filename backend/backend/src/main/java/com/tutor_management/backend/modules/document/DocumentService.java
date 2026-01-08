package com.tutor_management.backend.modules.document;

import com.tutor_management.backend.modules.document.dto.request.DocumentRequest;

import com.tutor_management.backend.modules.document.dto.response.DocumentResponse;
import com.tutor_management.backend.modules.document.dto.response.DocumentStats;
import com.tutor_management.backend.modules.document.dto.response.DocumentUploadResponse;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.shared.CloudinaryService;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
// ... imports

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {



    private final DocumentRepository documentRepository;
    private final DocumentCategoryRepository documentCategoryRepository;
    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final CloudinaryService cloudinaryService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public Page<DocumentResponse> getAllDocuments(Pageable pageable) {
        Page<Document> documents = documentRepository.findAllWithStudent(pageable);
        return documents.map(this::convertToResponse);
    }

    public List<DocumentResponse> getAllDocuments() {
        List<Document> documents = documentRepository.findAllWithStudent();
        return documents.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<DocumentResponse> getDocumentsByCategory(DocumentCategoryType category, Pageable pageable) {
        Page<Document> documents = documentRepository.findByCategoryCode(category.name(), pageable);
        return documents.map(this::convertToResponse);
    }

    public List<DocumentResponse> getDocumentsByCategory(DocumentCategoryType category) {
        List<Document> documents = documentRepository.findByCategoryCodeOrderByCreatedAtDesc(category.name());
        return documents.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentResponse> searchDocuments(String keyword) {
        List<Document> documents = documentRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword);
        return documents.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "documentStats", allEntries = true)
    public DocumentUploadResponse uploadDocument(
            MultipartFile file,
            DocumentRequest request
    ) {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new RuntimeException("Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, TXT allowed");
        }

        try {
            // Upload to Cloudinary
            String cloudinaryUrl = cloudinaryService.uploadFile(file, "tutor-documents");

            // Get student if provided
            Student student = null;
            if (request.getStudentId() != null) {
                student = studentRepository.findById(request.getStudentId())
                        .orElse(null);
            }

            // Get category by code
            DocumentCategory category = documentCategoryRepository.findByCode(request.getCategory())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategory()));

            // Create document entity
            Document document = Document.builder()
                    .title(request.getTitle())
                    .fileName(file.getOriginalFilename())
                    .filePath(cloudinaryUrl) // Store Cloudinary URL
                    .fileSize(file.getSize())
                    .fileType(contentType)
                    .category(category)
                    .description(request.getDescription())
                    .student(student)
                    .downloadCount(0L)
                    .build();

            Document saved = documentRepository.save(document);

            System.out.println("✅ Document saved to database with ID: " + saved.getId());

            return DocumentUploadResponse.builder()
                    .id(saved.getId())
                    .title(saved.getTitle())
                    .fileName(saved.getFileName())
                    .message("File uploaded successfully")
                    .build();

        } catch (Exception e) {
            System.err.println("❌ Failed to upload document: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        return convertToResponse(document);
    }

    /**
     * Get document URL for download (increments download count)
     */
    public String getDocumentUrl(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        // Increment download count
        document.setDownloadCount(document.getDownloadCount() + 1);
        documentRepository.save(document);

        return document.getFilePath();
    }

    /**
     * Get document URL for preview (does NOT increment download count)
     */
    public String getPreviewUrl(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        return document.getFilePath();
    }

    @CacheEvict(value = "documentStats", allEntries = true)
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        try {
            // 1. Delete from Cloudinary
            cloudinaryService.deleteFile(document.getFilePath());

            // 2. Clear references in session_documents (Join Table)
            sessionRecordRepository.deleteDocumentReferences(id);

            // 3. Delete from database
            documentRepository.delete(document);
        } catch (Exception e) {
            System.err.println("❌ Error deleting document: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete document: " + e.getMessage(), e);
        }
    }

    @Cacheable("documentStats")
    public DocumentStats getStatistics() {
        // 1. Get Aggregated Stats (Count, Size, Downloads) in ONE query
        Object aggregatedStatsObj = documentRepository.getAggregatedStats();
        Object[] aggregatedStats = (Object[]) aggregatedStatsObj;
        
        Long totalDocuments = (Long) aggregatedStats[0];
        Long totalSize = (Long) aggregatedStats[1];
        Long totalDownloads = (Long) aggregatedStats[2];

        // 2. Get Category Stats in ONE query using GROUP BY
        List<Object[]> categoryStatsList = documentRepository.countDocumentsByCategoryCode();
        java.util.Map<String, Long> statsMap = new java.util.HashMap<>();
        
        // Initialize map with 0 for all enum values (to ensure all categories are present even if count is 0)
        for (DocumentCategoryType type : DocumentCategoryType.values()) {
             statsMap.put(type.name(), 0L);
        }

        // Fill in actual counts
        for (Object[] row : categoryStatsList) {
             String code = (String) row[0];
             Long count = (Long) row[1];
             if (code != null) {
                statsMap.put(code, count);
             }
        }

        return DocumentStats.builder()
                .totalDocuments(totalDocuments)
                .totalSize(totalSize)
                .formattedTotalSize(formatFileSize(totalSize != null ? totalSize : 0))
                .totalDownloads(totalDownloads)
                .categoryStats(statsMap)
                .build();
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
                contentType.equals("application/pdf") ||
                        contentType.equals("application/msword") ||
                        contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                        contentType.equals("application/vnd.ms-powerpoint") ||
                        contentType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation") ||
                        contentType.equals("text/plain")
        );
    }

    private DocumentResponse convertToResponse(Document document) {
        return DocumentResponse.builder()
                .id(document.getId())
                .title(document.getTitle())
                .fileName(document.getFileName())
                .filePath(document.getFilePath())
                .fileSize(document.getFileSize())
                .fileType(document.getFileType())
                .category(document.getCategoryType() != null ? document.getCategoryType() : 
                         (document.getCategory() != null ? parseCategoryType(document.getCategory().getCode()) : DocumentCategoryType.OTHER))
                .categoryDisplayName(document.getCategory() != null ? document.getCategory().getName() : 
                                    (document.getCategoryType() != null ? document.getCategoryType().getDisplayName() : "N/A"))
                .categoryId(document.getCategory() != null ? document.getCategory().getId() : null)
                .categoryName(document.getCategory() != null ? document.getCategory().getName() : 
                             (document.getCategoryType() != null ? document.getCategoryType().name() : null))
                .studentId(document.getStudent() != null ? document.getStudent().getId() : null)
                .studentName(document.getStudent() != null ? document.getStudent().getName() : null)
                .downloadCount(document.getDownloadCount())
                .createdAt(document.getCreatedAt().format(formatter))
                .updatedAt(document.getUpdatedAt().format(formatter))
                .formattedFileSize(formatFileSize(document.getFileSize()))
                .build();
    }

    private DocumentCategoryType parseCategoryType(String code) {
        if (code == null) return DocumentCategoryType.OTHER;
        try {
            return DocumentCategoryType.valueOf(code);
        } catch (IllegalArgumentException e) {
            return DocumentCategoryType.OTHER;
        }
    }

    private String formatFileSize(long size) {
        return getString(size);
    }

    public static String getString(long size) {
        if (size <= 0) return "0 B";
        final String[] units = new String[] { "B", "KB", "MB", "GB" };
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.2f %s",
                size / Math.pow(1024, digitGroups),
                units[digitGroups]);
    }
}
