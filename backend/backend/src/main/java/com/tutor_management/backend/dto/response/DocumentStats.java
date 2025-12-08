package com.tutor_management.backend.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentStats {
    private Long totalDocuments;
    private Long totalSize;
    private String formattedTotalSize;
    private Long totalDownloads;
    private DocumentCategoryStats categoryStats;
}
