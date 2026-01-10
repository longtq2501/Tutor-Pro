package com.tutor_management.backend.modules.finance.dto.response;

import lombok.*;

import java.util.List;

/**
 * Response payload for invoice details, intended for export or display.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    
    /**
     * Unique identifier for the invoice (e.g., INV-2024-12-001).
     */
    private String invoiceNumber;
    
    private String studentName;
    
    /**
     * Human-readable month representation (e.g., Tháng 12/2024).
     */
    private String month;
    
    private Integer totalSessions;
    private Double totalHours;
    private Long totalAmount;
    
    /**
     * Detailed breakdown of sessions included in the invoice.
     */
    private List<InvoiceItem> items;
    
    private BankInfo bankInfo;
    
    /**
     * URL for generating the VietQR payment QR code.
     */
    private String qrCodeUrl;
    
    private String createdDate;
}
