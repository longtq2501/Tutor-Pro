package com.tutor_management.backend.dto.response;

import com.tutor_management.backend.entity.DocumentCategory;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String title;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private DocumentCategory category;
    private String categoryDisplayName;
    private String description;
    private Long studentId;
    private String studentName;
    private Long downloadCount;
    private String createdAt;
    private String updatedAt;
    private String formattedFileSize;
}