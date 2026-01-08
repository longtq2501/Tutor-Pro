package com.tutor_management.backend.modules.shared;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;

/**
 * Controller for managing feature flags.
 * 
 * Feature flags allow gradual rollout of new features and quick rollback if
 * issues occur.
 * Frontend can query this endpoint to check which features are enabled.
 * 
 * @author AI Agent
 * @since 2025-12-26
 */
@Slf4j
@RestController
@RequestMapping("/api/feature-flags")
@CrossOrigin(origins = "*")
public class FeatureFlagController {

    /**
     * Feature flags configuration.
     * In production, this should be moved to database or external config service
     * (e.g., LaunchDarkly, Firebase Remote Config, or Redis).
     */
    private final Map<String, Boolean> featureFlags = new HashMap<>() {
        {
            // Phase 1: Core Improvements
            put("enhanced_lesson_card", true); // Week 1: 10% rollout
            put("status_legend", true); // Week 1: 10% rollout
            put("compact_lesson_list", true); // Week 1: 10% rollout

            // Phase 2: Interactions
            put("quick_actions", false); // Week 2: Not yet enabled
            put("lesson_detail_modal", false); // Week 2: Not yet enabled
            put("context_menu", false); // Week 3: Not yet enabled

            // Phase 3: Multiple Views
            put("multiple_views", false); // Week 2: Not yet enabled
            put("week_view", false); // Week 2: Not yet enabled
            put("day_view", false); // Week 2: Not yet enabled
            put("list_view", false); // Week 2: Not yet enabled
            put("weekly_stats", false); // Week 3: Not yet enabled

            // Phase 4: Export
            put("export_functionality", false); // Week 4: Not yet enabled
            put("export_pdf", false); // Week 4: Not yet enabled
            put("export_excel", false); // Week 4: Not yet enabled
            put("print_calendar", false); // Week 4: Not yet enabled
        }
    };

    /**
     * Get all feature flags.
     * 
     * @return Map of feature names to enabled status
     */
    @GetMapping
    public ResponseEntity<Map<String, Boolean>> getAllFlags() {
        log.debug("Fetching all feature flags");
        return ResponseEntity.ok(featureFlags);
    }

    /**
     * Get a specific feature flag.
     * 
     * @param featureName Name of the feature
     * @return Feature enabled status
     */
    @GetMapping("/{featureName}")
    public ResponseEntity<Map<String, Object>> getFlag(@PathVariable String featureName) {
        boolean enabled = featureFlags.getOrDefault(featureName, false);

        log.debug("Feature flag '{}' is {}", featureName, enabled ? "enabled" : "disabled");

        return ResponseEntity.ok(Map.of(
                "feature", featureName,
                "enabled", enabled));
    }

    /**
     * Update a feature flag (Admin only).
     * 
     * In production, this should require admin authentication.
     * 
     * @param featureName Name of the feature
     * @param enabled     Whether to enable or disable
     * @return Updated feature status
     */
    @PutMapping("/{featureName}")
    // @PreAuthorize("hasRole('ADMIN')") // Uncomment in production
    public ResponseEntity<Map<String, Object>> updateFlag(
            @PathVariable String featureName,
            @RequestParam boolean enabled) {
        boolean oldValue = featureFlags.getOrDefault(featureName, false);
        featureFlags.put(featureName, enabled);

        log.info("Feature flag '{}' changed: {} -> {}", featureName, oldValue, enabled);

        return ResponseEntity.ok(Map.of(
                "feature", featureName,
                "enabled", enabled,
                "previousValue", oldValue,
                "message", String.format("Feature '%s' is now %s",
                        featureName,
                        enabled ? "enabled" : "disabled")));
    }

    /**
     * Bulk update feature flags (Admin only).
     * 
     * @param flags Map of feature names to enabled status
     * @return Updated flags
     */
    @PutMapping
    // @PreAuthorize("hasRole('ADMIN')") // Uncomment in production
    public ResponseEntity<Map<String, Object>> bulkUpdateFlags(
            @RequestBody Map<String, Boolean> flags) {
        int updated = 0;

        for (Map.Entry<String, Boolean> entry : flags.entrySet()) {
            String feature = entry.getKey();
            Boolean enabled = entry.getValue();

            if (featureFlags.containsKey(feature)) {
                featureFlags.put(feature, enabled);
                updated++;
                log.info("Feature flag '{}' set to {}", feature, enabled);
            }
        }

        return ResponseEntity.ok(Map.of(
                "updated", updated,
                "total", flags.size(),
                "message", String.format("Updated %d feature flags", updated)));
    }
}
