package com.tutor_management.backend.modules.document.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class DocumentStats {
    private Long totalDocuments;
    private Long totalSize;
    private String formattedTotalSize;
    private Long totalDownloads;
    private Map<String, Long> categoryStats; // Dynamic Map: "GRAMMAR" -> 10
}
