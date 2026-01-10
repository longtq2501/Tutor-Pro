package com.tutor_management.backend.modules.dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

/**
 * Personal statistics and progress indicators for a specific student's dashboard.
 * Includes attendance data, financial state, and motivational feedback.
 */
@Data
@Builder
public class StudentDashboardStats {
    // === RAW DATA (For Charts and Logic) ===
    
    /** Total number of scheduled sessions for the period */
    private int totalSessionsRaw;
    
    /** Number of sessions successfully completed or paid */
    private int completedSessionsRaw;
    
    /** Sum of lesson hours attended */
    private double totalHoursRaw;
    
    /** Total amount paid by the student in the period */
    private long totalPaidRaw;
    
    /** Outstanding unpaid balance for the period */
    private long totalUnpaidRaw;
    
    /** Total cost of all sessions in the period */
    private long totalAmountRaw;
    
    /** Count of learning documents/materials available to the student */
    private int totalDocumentsRaw;

    // === FORMATTED DATA (For UI Display) ===
    
    /** Total hours with unit suffix, e.g., "12.5h" */
    private String totalHoursFormatted;
    
    /** Paid amount formatted as currency */
    private String totalPaidFormatted;
    
    /** Unpaid amount formatted as currency */
    private String totalUnpaidFormatted;
    
    /** Total amount formatted as currency */
    private String totalAmountFormatted;

    // === GAMIFICATION & FEEDBACK ===
    
    /** Context-aware encouraging message based on completion percentage */
    private String motivationalQuote;
    
    /** Flag to trigger UI celebration effects when goals are fully achieved */
    private boolean showConfetti;
}
