package com.tutor_management.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private String name;
    private String phone;
    private String schedule;
    private Long pricePerHour;
    private String notes;
    private Boolean active; // 🆕
    private String startMonth; // 🆕
    private String lastActiveMonth; // 🆕
    private Integer monthsLearned; // 🆕 Số tháng đã học
    private String learningDuration; // 🆕 Text hiển thị: "Bắt đầu: 11/2024 • 2 tháng"
    private String createdAt;
    private Long totalPaid;
    private Long totalUnpaid;
}
