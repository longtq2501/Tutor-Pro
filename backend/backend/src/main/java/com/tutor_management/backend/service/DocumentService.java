package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.DocumentRequest;
import com.tutor_management.backend.dto.response.DocumentCategoryStats;
import com.tutor_management.backend.dto.response.DocumentResponse;
import com.tutor_management.backend.dto.response.DocumentStats;
import com.tutor_management.backend.dto.response.DocumentUploadResponse;
import com.tutor_management.backend.entity.*;
import com.tutor_management.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StudentRepository studentRepository;
    private final CloudinaryService cloudinaryService;
    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    public List<DocumentResponse> getAllDocuments() {
        List<Document> documents = documentRepository.findAllByOrderByCreatedAtDesc();
        return documents.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<DocumentResponse> getDocumentsByCategory(DocumentCategory category) {
        List<Document> documents = documentRepository.findByCategoryOrderByCreatedAtDesc(category);
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
            System.out.println("📄 Processing document upload:");
            System.out.println("   Title: " + request.getTitle());
            System.out.println("   Category: " + request.getCategory());
            System.out.println("   File: " + file.getOriginalFilename());

            // Upload to Cloudinary
            String cloudinaryUrl = cloudinaryService.uploadFile(file, "tutor-documents");

            // Get student if provided
            Student student = null;
            if (request.getStudentId() != null) {
                student = studentRepository.findById(request.getStudentId())
                        .orElse(null);
            }

            // Create document entity
            Document document = Document.builder()
                    .title(request.getTitle())
                    .fileName(file.getOriginalFilename())
                    .filePath(cloudinaryUrl) // Store Cloudinary URL
                    .fileSize(file.getSize())
                    .fileType(contentType)
                    .category(request.getCategory())
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
        System.out.println("📥 Getting download URL for document ID: " + id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        // Increment download count
        document.setDownloadCount(document.getDownloadCount() + 1);
        documentRepository.save(document);

        System.out.println("✅ Download count incremented to: " + document.getDownloadCount());
        System.out.println("   URL: " + document.getFilePath());

        return document.getFilePath();
    }

    /**
     * Get document URL for preview (does NOT increment download count)
     */
    public String getPreviewUrl(Long id) {
        System.out.println("👁️ Getting preview URL for document ID: " + id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        System.out.println("✅ Preview URL retrieved");
        System.out.println("   URL: " + document.getFilePath());

        return document.getFilePath();
    }

    public void deleteDocument(Long id) {
        System.out.println("🗑️ Deleting document ID: " + id);

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        try {
            // Delete from Cloudinary
            cloudinaryService.deleteFile(document.getFilePath());

            // Delete from database
            documentRepository.delete(document);

            System.out.println("✅ Document deleted successfully");

        } catch (Exception e) {
            System.err.println("❌ Error deleting document: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete document: " + e.getMessage(), e);
        }
    }

    public DocumentStats getStatistics() {
        Long totalDocuments = documentRepository.count();
        Long totalSize = documentRepository.sumTotalFileSize();
        Long totalDownloads = documentRepository.sumTotalDownloads();

        DocumentCategoryStats categoryStats = DocumentCategoryStats.builder()
                .grammar(documentRepository.countByCategory(DocumentCategory.GRAMMAR))
                .vocabulary(documentRepository.countByCategory(DocumentCategory.VOCABULARY))
                .reading(documentRepository.countByCategory(DocumentCategory.READING))
                .listening(documentRepository.countByCategory(DocumentCategory.LISTENING))
                .speaking(documentRepository.countByCategory(DocumentCategory.SPEAKING))
                .writing(documentRepository.countByCategory(DocumentCategory.WRITING))
                .exercises(documentRepository.countByCategory(DocumentCategory.EXERCISES))
                .exam(documentRepository.countByCategory(DocumentCategory.EXAM))
                .pet(documentRepository.countByCategory(DocumentCategory.PET))
                .fce(documentRepository.countByCategory(DocumentCategory.FCE))
                .ielts(documentRepository.countByCategory(DocumentCategory.IELTS))
                .toeic(documentRepository.countByCategory(DocumentCategory.TOEIC))
                .other(documentRepository.countByCategory(DocumentCategory.OTHER))
                .build();

        return DocumentStats.builder()
                .totalDocuments(totalDocuments)
                .totalSize(totalSize)
                .formattedTotalSize(formatFileSize(totalSize != null ? totalSize : 0)) // ✅ Fixed
                .totalDownloads(totalDownloads)
                .categoryStats(categoryStats)
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
                .category(document.getCategory())
                .categoryDisplayName(document.getCategory().getDisplayName())
                .description(document.getDescription())
                .studentId(document.getStudent() != null ? document.getStudent().getId() : null)
                .studentName(document.getStudent() != null ? document.getStudent().getName() : null)
                .downloadCount(document.getDownloadCount())
                .createdAt(document.getCreatedAt().format(formatter))
                .updatedAt(document.getUpdatedAt().format(formatter))
                .formattedFileSize(formatFileSize(document.getFileSize())) // ✅ Fixed
                .build();
    }

    /**
     * Format file size for display
     * ✅ Added this method to fix the error
     */
    private String formatFileSize(long size) {
        if (size <= 0) return "0 B";
        final String[] units = new String[] { "B", "KB", "MB", "GB" };
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return String.format("%.2f %s",
                size / Math.pow(1024, digitGroups),
                units[digitGroups]);
    }
}