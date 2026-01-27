package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for whiteboard clear messages.
 * Allows clearing only specific user's strokes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardClearMessage {
    
    @JsonProperty("type")
    private String type; // Should be "CLEAR"
    
    @JsonProperty("userId")
    private String userId; // User whose strokes to clear
}
