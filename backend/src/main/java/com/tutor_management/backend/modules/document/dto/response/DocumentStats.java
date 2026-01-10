package com.tutor_management.backend.modules.document.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Aggregated statistics for the entire document library.
 */
@Data
@Builder
public class DocumentStats {
    /** Total number of files uploaded */
    private Long totalDocuments;
    
    /** Total disk usage in bytes */
    private Long totalSize;
    
    /** Human-readable total storage footprint */
    private String formattedTotalSize;
    
    /** Total number of file openings across all resources */
    private Long totalDownloads;
    
    /** Breakdown of document counts by category code */
    private Map<String, Long> categoryStats;
}
