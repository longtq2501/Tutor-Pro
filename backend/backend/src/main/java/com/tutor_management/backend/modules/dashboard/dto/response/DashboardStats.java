package com.tutor_management.backend.modules.dashboard.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Integer totalStudents;

    // Các trường String trả về Frontend
    private String totalPaidAllTime;
    private String totalUnpaidAllTime;
    private String currentMonthTotal;
    private Long currentMonthUnpaid;

    private Double revenueTrendValue;
    private String revenueTrendDirection;

    // Các trường Raw để Frontend tính toán Progress Bar
    private Long totalPaidRaw;
    private Long totalUnpaidRaw;
    private Long currentMonthTotalRaw;

    // Constructor 5 tham số ĐÚNG CHUẨN cho JPQL
    public DashboardStats(Integer totalStudents, Long totalPaidRaw, Long totalUnpaidRaw, Long currentMonthTotalRaw, Long currentMonthUnpaid) {
        this.totalStudents = totalStudents;
        this.totalPaidRaw = totalPaidRaw != null ? totalPaidRaw : 0L;
        this.totalUnpaidRaw = totalUnpaidRaw != null ? totalUnpaidRaw : 0L;
        this.currentMonthTotalRaw = currentMonthTotalRaw != null ? currentMonthTotalRaw : 0L;
        this.currentMonthUnpaid = currentMonthUnpaid != null ? currentMonthUnpaid : 0L;
    }
}