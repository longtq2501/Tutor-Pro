package com.tutor_management.backend.modules.document.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Limited response containing verification data after a successful file upload.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentUploadResponse {
    /** Records the newly generated ID */
    private Long id;
    
    /** Echoes the assigned title */
    private String title;
    
    /** Echoes the stored filename */
    private String fileName;
    
    /** Success message for UI feedback */
    private String message;
}
