package com.tutor_management.backend.modules.document.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentUploadResponse {
    private Long id;
    private String title;
    private String fileName;
    private String message;
}
