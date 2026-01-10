package com.tutor_management.backend.modules.shared;

import com.tutor_management.backend.modules.shared.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;

/**
 * Controller for managing runtime feature toggles.
 * Allows gradual rollout and quick recovery by enabling/disabling features without deployments.
 * 
 * @since 2025-12-26
 */
@Slf4j
@RestController
@RequestMapping("/api/feature-flags")
@CrossOrigin(origins = "*")
public class FeatureFlagController {

    /**
     * Internal feature flag store.
     * FIXME: Move to a persistent storage (Database or Redis) for multi-instance support.
     */
    private final Map<String, Boolean> featureFlags = new HashMap<>() {{
        // Phase 1: UI Improvements
        put("enhanced_lesson_card", true);
        put("status_legend", true);
        put("compact_lesson_list", true);

        // Future Phases
        put("quick_actions", false);
        put("lesson_detail_modal", false);
        put("context_menu", false);
        put("multiple_views", false);
        put("week_view", false);
        put("day_view", false);
        put("list_view", false);
        put("weekly_stats", false);
        put("export_functionality", false);
        put("export_pdf", false);
        put("export_excel", false);
        put("print_calendar", false);
    }};

    /**
     * Retrieves all active feature flags.
     * 
     * @return A map of feature names and their Boolean statuses.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> getAllFlags() {
        log.debug("Fetching all feature flags");
        return ResponseEntity.ok(ApiResponse.success(featureFlags));
    }

    /**
     * Checks the status of a specific feature flag.
     * 
     * @param featureName Unique identifier of the feature.
     * @return Current status of the requested feature.
     */
    @GetMapping("/{featureName}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFlag(@PathVariable String featureName) {
        boolean enabled = featureFlags.getOrDefault(featureName, false);
        log.debug("Feature flag '{}' status: {}", featureName, enabled);
        
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "feature", featureName,
                "enabled", enabled)));
    }

    /**
     * Updates the status of a feature flag.
     * 
     * @param featureName Unique identifier of the feature.
     * @param enabled     New status to apply.
     * @return Confirmation of the change and previous value.
     */
    @PutMapping("/{featureName}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateFlag(
            @PathVariable String featureName,
            @RequestParam boolean enabled) {
        
        boolean oldValue = featureFlags.getOrDefault(featureName, false);
        featureFlags.put(featureName, enabled);
        log.info("Transitioned feature flag '{}': {} -> {}", featureName, oldValue, enabled);

        return ResponseEntity.ok(ApiResponse.success("Đã cập nhật tính năng " + featureName, Map.of(
                "feature", featureName,
                "enabled", enabled,
                "previousValue", oldValue)));
    }

    /**
     * Performs a bulk update of multiple feature flags.
     * 
     * @param flags Map of features to update.
     * @return Summary of updated features.
     */
    @PutMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> bulkUpdateFlags(
            @RequestBody Map<String, Boolean> flags) {
        
        int updatedCount = 0;
        for (Map.Entry<String, Boolean> entry : flags.entrySet()) {
            if (featureFlags.containsKey(entry.getKey())) {
                featureFlags.put(entry.getKey(), entry.getValue());
                updatedCount++;
            }
        }
        
        log.info("Bulk updated {} feature flags", updatedCount);
        return ResponseEntity.ok(ApiResponse.success(String.format("Đã cập nhật xong %d tính năng", updatedCount), Map.of(
                "updatedCount", updatedCount,
                "totalRequested", flags.size())));
    }
}
