package com.tutor_management.backend.modules.finance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionRecordResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String month;
    private Integer sessions;
    private Double hours;
    private Long pricePerHour;
    private Long totalAmount;
    private Boolean paid;
    private String paidAt;
    private String notes;
    private String sessionDate; // 🆕 Ngày dạy (String để dễ serialize)
    private String createdAt;
    private Boolean completed; // Trạng thái đã dạy (deprecated, use status instead)

    // ========== NEW FIELDS FOR CALENDAR OPTIMIZATION ==========
    private String startTime; // Giờ bắt đầu (HH:mm format, e.g., "14:00")
    private String endTime; // Giờ kết thúc (HH:mm format, e.g., "15:30")
    private String subject; // Môn học (e.g., "Toán 10", "Lý 11")
    private String status; // Trạng thái chi tiết (SCHEDULED, CONFIRMED, COMPLETED, PAID, etc.)
    private Integer version; // Version for optimistic locking
}
