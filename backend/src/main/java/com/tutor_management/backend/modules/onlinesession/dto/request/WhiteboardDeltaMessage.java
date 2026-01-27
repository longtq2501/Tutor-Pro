package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for delta messages sent during active drawing (every 50ms).
 * Corresponds to StrokeDeltaMessage in TypeScript.
 * Reduces payload size by 80%+ by sending only new points.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardDeltaMessage {
    
    @JsonProperty("type")
    private String type; // Should be "STROKE_DELTA"
    
    @JsonProperty("strokeId")
    private String strokeId;
    
    @JsonProperty("points")
    private List<WhiteboardStrokeMessage.Point> points;
    
    @JsonProperty("startIndex")
    private Integer startIndex;
    
    @JsonProperty("color")
    private String color;
    
    @JsonProperty("width")
    private Integer width;
    
    @JsonProperty("tool")
    private String tool; // "pen" or "eraser"
    
    @JsonProperty("userId")
    private String userId; // ✅ CRITICAL: Must preserve userId for echo cancellation
}
