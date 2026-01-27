package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for undo messages.
 * Corresponds to UndoMessage in TypeScript.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardUndoMessage {
    
    @JsonProperty("type")
    private String type; // Should be "UNDO"
    
    @JsonProperty("id")
    private String id; // Stroke ID to remove
    
    @JsonProperty("userId")
    private String userId; // Optional: track who initiated undo
}
