package com.tutor_management.backend.modules.onlinesession.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for complete stroke messages sent when user finishes drawing.
 * Corresponds to CompleteStrokeMessage in TypeScript.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiteboardStrokeMessage {
    
    @JsonProperty("type")
    private String type; // Should be "STROKE"
    
    @JsonProperty("stroke")
    private StrokeData stroke;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StrokeData {
        @JsonProperty("id")
        private String id;
        
        @JsonProperty("points")
        private List<Point> points;
        
        @JsonProperty("color")
        private String color;
        
        @JsonProperty("width")
        private Integer width;
        
        @JsonProperty("tool")
        private String tool; // "pen" or "eraser"
        
        @JsonProperty("timestamp")
        private Long timestamp;
        
        @JsonProperty("userId")
        private String userId; // ✅ CRITICAL: Must preserve userId for echo cancellation
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Point {
        @JsonProperty("x")
        private Double x;
        
        @JsonProperty("y")
        private Double y;
    }
}
