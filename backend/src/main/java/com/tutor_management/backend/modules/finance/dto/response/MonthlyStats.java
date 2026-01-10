package com.tutor_management.backend.modules.finance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Aggregated financial statistics for a specific month.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStats {
    private String month;
    private Long totalPaid;
    private Long totalUnpaid;
    private Integer totalSessions;
}
