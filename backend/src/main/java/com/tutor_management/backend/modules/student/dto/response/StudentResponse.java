package com.tutor_management.backend.modules.student.dto.response;

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
    private Boolean active;
    private String startMonth;
    private String lastActiveMonth;
    private Integer monthsLearned;
    private String learningDuration;
    private String createdAt;
    private Long totalPaid;
    private Long totalUnpaid;

    // ✅ THÊM CÁC FIELD PARENT
    private Long parentId;
    private String parentName;
    private String parentEmail;
    private String parentPhone;

    // ✅ THÊM FIELD ACCOUNT
    private String accountEmail;
    private String accountId;
}
