package com.tutor_management.backend.modules.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentDashboardStats {
    // === RAW DATA (For Charts/Logic) ===
    private int totalSessionsRaw;
    private int completedSessionsRaw;
    private double totalHoursRaw;
    private long totalPaidRaw;
    private long totalUnpaidRaw;
    private long totalAmountRaw;
    private int totalDocumentsRaw;

    // === FORMATTED DATA (For UI Display) ===
    private String totalHoursFormatted; // e.g., "12.5h"
    private String totalPaidFormatted; // e.g., "2.000.000 đ"
    private String totalUnpaidFormatted;
    private String totalAmountFormatted;

    // === ENCOURAGEMENT ===
    private String motivationalQuote; // e.g., "Tuyệt vời! Bạn đã hoàn thành 80% mục tiêu."
    private boolean showConfetti; // true if completedSessions == totalSessions
}
