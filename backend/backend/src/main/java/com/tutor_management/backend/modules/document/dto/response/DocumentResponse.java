package com.tutor_management.backend.modules.document.dto.response;

import com.tutor_management.backend.modules.document.DocumentCategory;
import com.tutor_management.backend.modules.document.DocumentCategoryType;
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
    private DocumentCategoryType category;
    private String categoryDisplayName;
    private Long categoryId;
    private String categoryName;
    private String description;
    private Long studentId;
    private String studentName;
    private Long downloadCount;
    private String createdAt;
    private String updatedAt;
    private String formattedFileSize;
}
