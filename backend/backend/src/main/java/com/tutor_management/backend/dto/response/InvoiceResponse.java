package com.tutor_management.backend.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private String invoiceNumber; // INV-2024-12-001
    private String studentName;
    private String month;
    private Integer totalSessions;
    private Integer totalHours;
    private Long totalAmount;
    private List<InvoiceItem> items;
    private BankInfo bankInfo;
    private String qrCodeUrl;
    private String createdDate;
}

